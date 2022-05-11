import { rules, schema } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    firstName: schema.string.optional(),
    lastName: schema.string.optional(),
    employmentDate: schema.date.optional(),
    birthDate: schema.date.optional(),
    phone: schema.string.optional(),
  });

  public messages = {};
}
