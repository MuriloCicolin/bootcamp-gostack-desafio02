import * as Yup from 'yup';
import Recipients from '../models/Recipients';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string()
        .min(2)
        .required(),
      city: Yup.string().required(),
      zipCode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      name,
      street,
      number,
      state,
      city,
      zipCode,
    } = await Recipients.create(req.body);

    const recipients = {
      name,
      street,
      number,
      state,
      city,
      zipCode,
    };

    return res.json(recipients);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      zipCode: Yup.string().required(),
      street: Yup.string()
        .required()
        .when('zipCode', (zipCode, field) =>
          zipCode ? field.required() : field
        ),
      number: Yup.number().required(),
      state: Yup.string()
        .max(2)
        .required(),
      city: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const recipients = await Recipients.findByPk(id);

    const {
      name,
      street,
      number,
      state,
      city,
      zipCode,
    } = await recipients.update(req.body);

    return res.json({
      recipients: {
        name,
        street,
        number,
        state,
        city,
        zipCode,
      },
    });
  }
}

export default new RecipientController();
