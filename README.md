# URL Shortener with Analytics

A full-stack application to shorten URLs, generate QR codes, and track click analytics using a clean dashboard interface.

## 🔗 Live Frontend

**[Visit the App](https://url-shortener-pink-seven.vercel.app)** (Hosted on Vercel)

-Email: Testing@gmail.com
-Password: Test123

---

## 🚀 Features

- Secure login (demo credentials)
- URL shortening
- Click tracking and analytics
- QR code generation
- Dashboard with charts
- Detailed analytics per shortened link

---

## 📁 Frontend Routes

| Route                     | Description                                             |
|---------------------------|---------------------------------------------------------|
| `/`                       | Login page (hardcoded credentials)                     |
| `/shorten`                | Page to shorten a long URL                             |
| `/analytics`              | Dashboard for all URLs and click stats                 |
| `/analytics/:shortId`     | Detailed view for a single shortened URL               |

---

## 🌐 Backend Routes (Hosted on Render)

| Route                          | Description                                              |
|--------------------------------|----------------------------------------------------------|
| `GET /r/:shortId`              | Redirects to the original URL                           |
| `POST /auth/login`             | Login with hardcoded credentials                        |
| `POST /shorten`                | Shortens the given URL                                  |
| `GET /analytics`               | Returns all shortened URLs with their analytics         |
| `GET /analytics/data/:shortId` | Returns analytics for a specific shortened URL          |

---





