import { env } from './misc';
import { v2 } from 'cloudinary';

v2.config({
  cloud_name: env('CLOUDINARY_NAME'),
  api_key: env('CLOUDINARY_API_KEY'),
  api_secret: env('CLOUDINARY_API_SECRET'),
  secure: true,
});

export { v2 };
