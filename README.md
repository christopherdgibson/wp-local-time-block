# WordPress Plugin

Gutenberg block built from scratch using React —  a block that compares time between time zones.

## Local time
Displays local time (defaulting to current location) and another selectable time zone. API requests are routed through a WordPress PHP proxy to avoid CORS restrictions, with a retry mechanism handling timeouts and malformed responses.

## Tech stack
- React / JavaScript
- PHP (WordPress admin-ajax.php proxy)
- WordPress / Gutenberg
- XAMPP / Apache (local development)

## Demo
[View on WordPress Playground](https://playground.wordpress.net) ← coming soon

## Architecture
Plugin avoids WordPress block data APIs in favour of custom implementations — the editor (`edit.js`) and frontend (`save.js`) interfaces are written directly for full control over both the authoring experience and rendered output.

## Running locally
1. Install [XAMPP](https://www.apachefriends.org)
2. Clone into your WordPress plugins directory:
```bash
git clone https://github.com/christopherdgibson/wp-local-time-block.git wp-content/plugins/wp-local-time-block
```
3. Activate the plugin in WordPress admin
4. Add block via the Gutenberg editor

## Screenshots
![Daily Feed Block screenshot](docs/screenshots/local-time-screenshot.png)# wp-local-time-block