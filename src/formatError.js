import { InternalServerError } from './utils/errors';

const inProduction = process.env.NODE_ENV === 'production';

export default error => {
  if (inProduction) {
    // send error to tracking service
    console.log(error);
    return error;
  } else {
    console.log(error);
    console.log(error.extensions.exception.stacktrace);
  }

  const name = error.extensions.exception.name || '';
  if (name.startsWith('Mongo')) {
    return new InternalServerError();
  } else {
    return error;
  }
}
