# EDIZ IT Admin Portal (Node.js Version)

This folder contains the self-contained, production-ready **Node.js** version of the EDIZ IT Admin Portal. It runs completely dependency-free (using Node's native HTTP, file system, and compression modules) for maximum performance and easy setup.

---

## How to Run Locally

1. Open your terminal in this directory.
2. Run:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3008
   ```

---

## How to Deploy to Production

### Option 1: Deploy to Render.com or Railway.app (Recommended)
1. Push this folder to a GitHub repository.
2. Create a new **Web Service** on [Render.com](https://render.com) or [Railway.app](https://railway.app).
3. Connect your GitHub repository.
4. Set the build and start configuration:
   - **Build Command:** (leave empty)
   - **Start Command:** `node server.js` or `npm start`
5. The platform will automatically deploy your portal and provide an HTTPS URL.

### Option 2: Deploy to a VPS (e.g. Hostinger VPS, DigitalOcean)
1. Upload the files in this folder to your VPS.
2. Install PM2 globally to keep the server running in the background:
   ```bash
   npm install -g pm2
   ```
3. Start the server with PM2:
   ```bash
   pm2 start server.js --name "ediz-portal"
   ```
4. Set up Nginx as a reverse proxy to route domain traffic (e.g. `adminpayment.edizit.com` on port 80/443) to the Node.js server running on port `3008`.