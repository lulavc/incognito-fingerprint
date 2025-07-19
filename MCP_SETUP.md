# MCP Server Setup for Cursor

This project is configured with Model Context Protocol (MCP) servers to enhance development capabilities in Cursor.

## What is MCP?

Model Context Protocol (MCP) allows AI assistants to interact with external tools and data sources through standardized servers. This enables enhanced capabilities like:

- **GitHub Integration**: Access repository information, issues, and code
- **File System Access**: Read and analyze project files
- **Web Search**: Search the internet for current information
- **Browser Automation**: Test extensions with Puppeteer
- **Git Operations**: Manage version control operations

## Configured MCP Servers

### 1. GitHub Server
- **Purpose**: Access GitHub repositories, issues, and code
- **Setup**: Create a GitHub Personal Access Token
- **Get Token**: https://github.com/settings/tokens

### 2. Filesystem Server
- **Purpose**: Read and analyze project files
- **Setup**: Automatically configured to workspace folder
- **No API Key Required**

### 3. Brave Search Server
- **Purpose**: Search the web for current information
- **Setup**: Get API key from Brave Search API
- **Get API Key**: https://api.search.brave.com/

### 4. Web Search Server
- **Purpose**: Alternative web search capabilities
- **Setup**: Get API key from Serper
- **Get API Key**: https://serper.dev/

### 5. Puppeteer Server
- **Purpose**: Browser automation for testing extensions
- **Setup**: Automatically configured
- **No API Key Required**

### 6. Git Server
- **Purpose**: Git operations and repository management
- **Setup**: Automatically configured to workspace
- **No API Key Required**

## Setup Instructions

### 1. Create Environment File
```bash
# Copy the template
cp env-template.txt .env

# Edit the .env file with your API keys
nano .env
```

### 2. Get Required API Keys

#### GitHub Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:org`, `read:user`
4. Copy the token to your `.env` file

#### Brave Search API Key
1. Go to https://api.search.brave.com/
2. Sign up for an account
3. Get your API key
4. Add to your `.env` file

#### Serper API Key (Optional)
1. Go to https://serper.dev/
2. Sign up for an account
3. Get your API key
4. Add to your `.env` file

### 3. Restart Cursor
After setting up your API keys, restart Cursor to load the MCP configuration.

### 4. Verify Setup
In Cursor, you should see MCP servers connecting in the status bar or output panel.

## Usage Examples

### GitHub Integration
```
@github list issues in this repository
@github search code for "fingerprint"
@github get repository stats
```

### Web Search
```
@brave-search search for "latest browser fingerprinting techniques"
@web-search find information about Chrome extension development
```

### File System
```
@filesystem analyze the structure of this project
@filesystem read the manifest.json file
@filesystem list all JavaScript files
```

### Browser Testing
```
@puppeteer test the extension on a fingerprinting detection site
@puppeteer take a screenshot of the extension popup
@puppeteer run automated tests
```

### Git Operations
```
@git show recent commits
@git create a new branch for feature development
@git check the status of the repository
```

## Troubleshooting

### MCP Servers Not Connecting
1. Check that your API keys are correct in `.env`
2. Verify Cursor has access to the `.env` file
3. Restart Cursor after making changes
4. Check the Cursor output panel for error messages

### API Key Issues
- **GitHub**: Ensure token has correct scopes
- **Brave Search**: Verify API key is active
- **Serper**: Check account status and API limits

### Performance Issues
- Disable unused MCP servers in `.cursor/settings.json`
- Reduce `mcpMaxConcurrentRequests` if needed
- Increase `mcpServerTimeout` for slower connections

## Security Notes

- Never commit your `.env` file to version control
- Use environment-specific API keys
- Regularly rotate your API keys
- Monitor API usage to avoid rate limits

## Advanced Configuration

### Custom MCP Servers
You can add custom MCP servers by editing `.cursor/settings.json`:

```json
{
  "mcpServers": {
    "custom-server": {
      "command": "npx",
      "args": ["-y", "@your-org/mcp-server-custom"],
      "env": {
        "CUSTOM_API_KEY": "${env:CUSTOM_API_KEY}"
      }
    }
  }
}
```

### Server Health Monitoring
The configuration includes health monitoring with:
- Automatic server restart on failure
- Health check notifications
- Configurable retry attempts
- Performance monitoring

## Support

For issues with MCP servers:
1. Check the Cursor documentation
2. Review MCP server-specific documentation
3. Check API provider status pages
4. Verify network connectivity 