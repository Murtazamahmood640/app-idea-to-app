# BayPro Backend API Setup Guide

## How to Deploy the API on Hostinger

### Step 1: Upload the API files
1. Go to your Hostinger hPanel → File Manager
2. Navigate to `public_html/backend-php/`
3. Create a new folder called `api`
4. Upload ALL files from the `php-api/` folder in this project into `backend-php/api/`

Your file structure should look like:
```
public_html/
  backend-php/
    api/
      .htaccess
      index.php
      config/
        database.php
        cors.php
      helpers/
        jwt.php
        response.php
      controllers/
        auth.php
        products.php
        categories.php
        orders.php
        vendor.php
        cart.php
        user.php
        payment.php
      setup/
        create_tables.sql
    product-images/
    ...existing files...
```

### Step 2: Configure Database
1. Open `backend-php/api/config/database.php`
2. Update with your Hostinger MySQL credentials:
   - `DB_HOST` - usually `localhost`
   - `DB_NAME` - your database name (find in hPanel → Databases)
   - `DB_USER` - your database username
   - `DB_PASS` - your database password
3. Change `JWT_SECRET` to a random string

### Step 3: Setup Database Tables
1. Go to hPanel → Databases → phpMyAdmin
2. Open the SQL tab
3. Copy and paste the contents of `php-api/setup/create_tables.sql`
4. Click "Go" to execute
5. This will create/update tables: categories, products, product_images, orders, order_items, addresses

### Step 4: Update PayFast Credentials (Optional)
1. Open `backend-php/api/controllers/payment.php`
2. Update `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`
3. Set `PAYFAST_SANDBOX` to `false` for production

### Step 5: Verify .htaccess
Make sure your Hostinger has `mod_rewrite` enabled (it should by default).
The `.htaccess` file in the `api/` folder handles URL routing.

### Step 6: Test the API
Visit these URLs in your browser to test:
- `https://partsbaypro.com/backend-php/api/categories` → Should return JSON categories
- `https://partsbaypro.com/backend-php/api/products` → Should return JSON products

### Troubleshooting
- **404 errors**: Make sure `.htaccess` is uploaded and `mod_rewrite` is enabled
- **500 errors**: Check `database.php` credentials
- **CORS errors**: The `cors.php` file should handle this automatically
- **Auth issues**: Make sure your `users` table has `role`, `phone`, `avatar` columns

### Important Notes
- Your existing `users` table will be updated with new columns (`role`, `phone`, `avatar`)
- Existing users will default to `customer` role
- Product images are served from `backend-php/product-images/`
- The API automatically makes image URLs absolute
