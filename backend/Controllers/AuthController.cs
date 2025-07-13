using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet("login")]
    public IActionResult Login([FromQuery] string? returnUrl, [FromQuery] bool rememberMe = false)
    {
        var clientId = _configuration["Google:ClientId"];
        var frontendUrl = _configuration["FrontendUrl"];
        
        if (string.IsNullOrEmpty(clientId) || clientId == "YOUR_GOOGLE_CLIENT_ID")
        {
            _logger.LogError("Google ClientId not configured");
            return BadRequest("OAuth not configured");
        }

        // Store remember me preference in session
        if (rememberMe)
        {
            HttpContext.Session.SetString("RememberMe", "true");
        }

        // Store return URL in session
        if (!string.IsNullOrEmpty(returnUrl))
        {
            HttpContext.Session.SetString("ReturnUrl", returnUrl);
        }

        var redirectUri = $"{Request.Scheme}://{Request.Host}/api/auth/callback";
        var scope = "openid email profile";
        
        var googleAuthUrl = $"https://accounts.google.com/o/oauth2/v2/auth?" +
            $"client_id={clientId}&" +
            $"redirect_uri={Uri.EscapeDataString(redirectUri)}&" +
            $"response_type=code&" +
            $"scope={Uri.EscapeDataString(scope)}&" +
            $"access_type=offline&" +
            $"prompt=consent";

        return Redirect(googleAuthUrl);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string? code, [FromQuery] string? error)
    {
        var frontendUrl = _configuration["FrontendUrl"];
        
        if (!string.IsNullOrEmpty(error))
        {
            _logger.LogError("OAuth error: {Error}", error);
            return Redirect($"{frontendUrl}/login?error={Uri.EscapeDataString(error)}");
        }

        if (string.IsNullOrEmpty(code))
        {
            _logger.LogError("No authorization code received");
            return Redirect($"{frontendUrl}/login?error=no_code");
        }

        try
        {
            // Exchange code for tokens
            var tokens = await ExchangeCodeForTokens(code);
            
            // Get user info from Google
            var userInfo = await GetUserInfo(tokens.AccessToken);
            
            // Create JWT token
            var jwtToken = CreateJwtToken(userInfo);
            
            // Set refresh token as HTTP-only cookie
            var rememberMe = HttpContext.Session.GetString("RememberMe") == "true";
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Expires = rememberMe ? DateTime.UtcNow.AddDays(30) : DateTime.UtcNow.AddDays(1)
            };
            
            Response.Cookies.Append("refresh_token", tokens.RefreshToken, cookieOptions);
            
            // Get return URL from session
            var returnUrl = HttpContext.Session.GetString("ReturnUrl") ?? "/dashboard";
            
            // Redirect to frontend with JWT token
            return Redirect($"{frontendUrl}{returnUrl}?token={Uri.EscapeDataString(jwtToken)}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing OAuth callback");
            return Redirect($"{frontendUrl}/login?error=callback_error");
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refresh_token"];
        
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized();
        }

        try
        {
            // Exchange refresh token for new access token
            var tokens = await RefreshAccessToken(refreshToken);
            
            // Update refresh token cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(30)
            };
            
            Response.Cookies.Append("refresh_token", tokens.RefreshToken, cookieOptions);
            
            return Ok(new { accessToken = tokens.AccessToken });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return Unauthorized();
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("refresh_token");
        return Ok();
    }

    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized();
        }

        var token = authHeader.Substring("Bearer ".Length);
        
        try
        {
            // Validate JWT and extract user info
            var userInfo = ValidateJwtToken(token);
            return Ok(userInfo);
        }
        catch
        {
            return Unauthorized();
        }
    }

    private async Task<TokenResponse> ExchangeCodeForTokens(string code)
    {
        var clientId = _configuration["Google:ClientId"];
        var clientSecret = _configuration["Google:ClientSecret"];
        var redirectUri = $"{Request.Scheme}://{Request.Host}/api/auth/callback";

        using var client = new HttpClient();
        var tokenRequest = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("client_id", clientId),
            new KeyValuePair<string, string>("client_secret", clientSecret),
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
            new KeyValuePair<string, string>("redirect_uri", redirectUri)
        });

        var response = await client.PostAsync("https://oauth2.googleapis.com/token", tokenRequest);
        var content = await response.Content.ReadAsStringAsync();
        
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Token exchange failed: {content}");
        }

        return JsonSerializer.Deserialize<TokenResponse>(content);
    }

    private async Task<UserInfo> GetUserInfo(string accessToken)
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
        
        var response = await client.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
        var content = await response.Content.ReadAsStringAsync();
        
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Failed to get user info: {content}");
        }

        return JsonSerializer.Deserialize<UserInfo>(content);
    }

    private async Task<TokenResponse> RefreshAccessToken(string refreshToken)
    {
        var clientId = _configuration["Google:ClientId"];
        var clientSecret = _configuration["Google:ClientSecret"];

        using var client = new HttpClient();
        var tokenRequest = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("client_id", clientId),
            new KeyValuePair<string, string>("client_secret", clientSecret),
            new KeyValuePair<string, string>("refresh_token", refreshToken),
            new KeyValuePair<string, string>("grant_type", "refresh_token")
        });

        var response = await client.PostAsync("https://oauth2.googleapis.com/token", tokenRequest);
        var content = await response.Content.ReadAsStringAsync();
        
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Token refresh failed: {content}");
        }

        return JsonSerializer.Deserialize<TokenResponse>(content);
    }

    private string CreateJwtToken(UserInfo userInfo)
    {
        // For now, return a simple token. In production, use proper JWT library
        var tokenData = new
        {
            sub = userInfo.Id,
            email = userInfo.Email,
            name = userInfo.Name,
            picture = userInfo.Picture,
            exp = DateTimeOffset.UtcNow.AddMinutes(60).ToUnixTimeSeconds()
        };

        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(JsonSerializer.Serialize(tokenData)));
    }

    private UserInfo ValidateJwtToken(string token)
    {
        try
        {
            var json = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(token));
            var tokenData = JsonSerializer.Deserialize<dynamic>(json);
            
            // Check if token is expired
            var exp = tokenData.GetProperty("exp").GetInt64();
            if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() > exp)
            {
                throw new Exception("Token expired");
            }

            return new UserInfo
            {
                Id = tokenData.GetProperty("sub").GetString(),
                Email = tokenData.GetProperty("email").GetString(),
                Name = tokenData.GetProperty("name").GetString(),
                Picture = tokenData.GetProperty("picture").GetString()
            };
        }
        catch
        {
            throw new Exception("Invalid token");
        }
    }
}

public class TokenResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public string TokenType { get; set; }
    public int ExpiresIn { get; set; }
}

public class UserInfo
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string Picture { get; set; }
} 