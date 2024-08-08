# Clerk oAuth wrapper
- basically intercepts the authorize_url
- Whenever the user has been logged in, he's forwarded to the oAuth app's REAL authorize_url

## This app lets you 
- build custom login page design
- build custom password reset flow

## Missing:
- For simplicity, the custom password reset flow/set-my-password logic
- All images have been taken out

## This app contains
- login page
  - after login, the user is sent back to ?redirect_url=https://some.where
- logout page

# Function
1. Hit http://localhost:3000/sign-in?clientId=abcdef and login
2. Be forwarded to the oAuth app's REAL authorize_url

# Caveats
- There is some creativity to getting an auth code in the sandbox environment. I'm mimicking what I see in the browser logs here, parsing a cookie.
- Equally not proud of the logout/ page, probably can be improved.
- Still on Clerk SDK 4.x

Copyleft (L) Arno Teigseth 2024
