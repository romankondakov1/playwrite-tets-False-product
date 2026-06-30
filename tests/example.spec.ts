import { test, expect } from '@playwright/test';

const BASE_URL_PRODUCT = 'https://api.escuelajs.co/api/v1/products';
const BASE_URL_USERS = 'https://api.escuelajs.co/api/v1/users';

let productId: number;
let productTitle: string;
let userId: number;
let userName: string;
let userEmail: string;


test.describe('Products API', { tag: '@Products' }, () => {

  test.beforeEach(async ({ request }) => {
    productTitle = `Product ${Date.now()}`;

    const response = await request.post(BASE_URL_PRODUCT, {
      data: {
        title: productTitle,
        price: 350,
        description: 'Best Product ever',
        categoryId: 1,
        images: ['https://placehold.co/600x400']
      }
    });

    const body = await response.json();
    expect.soft(response.status()).toBe(201);
    expect.soft(body).toHaveProperty('title', productTitle);
    expect.soft(body).toHaveProperty('price', 350);
    expect.soft(body).toHaveProperty('description', 'Best Product ever');
  
    
    productId = body.id;
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`${BASE_URL_PRODUCT}/${productId}`, {
      failOnStatusCode: false
    });
  });

  test('Get product by id', async ({ request }) => {
    const response = await request.get(`${BASE_URL_PRODUCT}/${productId}`);

    expect(response.status()).toBe(200);

    const product = await response.json();
    expect.soft(response.status()).toBe(200);
    expect.soft(product).toHaveProperty('title', productTitle);
    expect.soft(product).toHaveProperty('price', 350);
  });

  test('Update product', async ({ request }) => {
    const updatedTitle = `Updated ${productTitle}`;

    const response = await request.put(`${BASE_URL_PRODUCT}/${productId}`, {
      data: {
        title: updatedTitle,
        price: 250,
        description: 'Updated Best Product',
        categoryId: 1,
        images: ['https://placehold.co/600x400']
      }
    });

    const body = await response.json();

    expect.soft(response.status()).toBe(200);
    expect.soft(body).toHaveProperty('title', updatedTitle);
    expect.soft(body).toHaveProperty('price', 250);
  });

  test('Delete product', async ({ request }) => {
    const response = await request.delete(`${BASE_URL_PRODUCT}/${productId}`);

    expect(response.status()).toBe(200);

    const getResponse = await request.get(
      `${BASE_URL_PRODUCT}/${productId}`,
      { failOnStatusCode: false }
    );

    expect.soft(getResponse.status()).toBe(400);

    productId = 0;
  });

});



test.describe('Users API', { tag: '@Users' }, () => {

  let userId: number;
  let userName: string;
  let userEmail: string;

  test.beforeEach(async ({ request }) => {

    await test.step('Create user', async () => {

      const response = await request.post(BASE_URL_USERS, {
        data: {
          name: 'Roman',
          email: `roma_${Date.now()}@gmail.com`,
          password: '1234',
          avatar: 'https://picsum.photos/880'
        }
      });

      expect(response.status()).toBe(201);

      const body = await response.json();

      userId = body.id;
      userName = body.name;
      userEmail = body.email;

      expect(body.name).toBe('Roman');
    });

  });

  test.afterEach(async ({ request }) => {

    await test.step('Delete user', async () => {

      const response = await request.delete(
        `${BASE_URL_USERS}/${userId}`,
        { failOnStatusCode: false }
      );

      expect([200, 404]).toContain(response.status());

    });

  });

  test('Get user', async ({ request }) => {

    await test.step('Get created user', async () => {

      const response = await request.get(`${BASE_URL_USERS}/${userId}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body.id).toBe(userId);
      expect(body.name).toBe(userName);
      expect(body.email).toBe(userEmail);

    });

  });

  test('Update user', async ({ request }) => {

    const updatedName = `Updated ${userName}`;
    const updatedEmail = `updated_${userEmail}`;

    await test.step('Update user', async () => {

      const response = await request.put(`${BASE_URL_USERS}/${userId}`, {
        data: {
          name: updatedName,
          email: updatedEmail
        }
      });

      expect(response.status()).toBe(200);

    });

    await test.step('Verify updated user', async () => {

      const response = await request.get(`${BASE_URL_USERS}/${userId}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body.name).toBe(updatedName);
      expect(body.email).toBe(updatedEmail);

    });

  });

});