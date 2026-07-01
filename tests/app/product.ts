import { test, expect } from '@playwright/test';

const BASE_URL_PRODUCT = 'https://api.escuelajs.co/api/v1/products';


let productId: number;
let productTitle: string;



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
