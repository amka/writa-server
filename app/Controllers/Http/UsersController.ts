import { schema, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';
import authConfig from 'Config/auth';

export default class UsersController {
  /**
   * Create/save a new user.
   * If the user is already exists, then error will be returned.
   *
   * @param ctx {HttpContextContract}
   * @returns JSON with message or Exception
   */
  public async register({ auth, request, response }: HttpContextContract) {
    let payload;

    // Validate the request data
    try {
      payload = await request.validate({
        schema: schema.create({
          email: schema.string({}, [rules.email()]),
          password: schema.string({}, [rules.minLength(6)]),
        }),
      });
    } catch (error) {
      return response.badRequest(error.message);
    }

    const { email, password } = payload;

    // Check if user exists
    const user = await User.findBy('email', email);
    if (user != null) {
      return response.badRequest({ error: 'User already exists' });
    }

    // Create user
    try {
      const user = await User.create({
        email,
        password,
      });

      // Generate token
      const token = await auth.use('api').generate(user)

      // I'm not sure do I need to return JWT or not.
      return response.created({ token, user });

    } catch (error) {
      return response.abort(500, error.message);
    }
  }

  /**
   * Login a user. If the user is not exists, then error will be returned.
   *
   * @param ctx {HttpContextContract}
   * @returns JSON with message or Exception
   */
  public async login({ auth, request, response }: HttpContextContract) {
    let payload;

    // Validate the request data
    try {
      payload = await request.validate({
        schema: schema.create({
          email: schema.string({}, [rules.email()]),
          password: schema.string({}, [rules.minLength(6)]),
        }),
      });
    } catch (error) {
      return response.badRequest(error.message);
    }

    const { email, password } = payload;

    try {
      const token = await auth.use('api').attempt(email, password);
      return response.ok(token);
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  /**
   * Return the currently logged in user.
   *
   * @param ctx {HttpContextContract}
   * @returns JSON with user data
   */
  public async me({ auth, response }: HttpContextContract) {
    const user = await auth.user;
    return response.ok(user);
  }

  /**
   * Revoke the currently logged in user.
   *
   * @param ctx {HttpContextContract}
   * @returns JSON with message
   */
  public async revoke({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke();
    return response.ok({ message: 'Token revoked' });
  }

  /**
   * Update user.
   *
   * @param ctx {HttpContextContract}
   * @returns JSON with User or Exception
   */
  public async update({ auth, request, response }: HttpContextContract) {
    const userId = request.param('id');

    if (auth.user?.id != userId) {
      return response.forbidden({ error: 'You are not allowed to update this user' });
    }

    const user = await User.find(userId);
    if (!user) {
      return response.notFound({ error: 'User not found' });
    }

    let payload = await request.validate(UpdateUserValidator);

    try {
      const merged = await user.merge(payload).save();
      return response.ok(merged);
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }
}
