import keyBy from 'lodash/keyBy.js';
import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации.
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках.
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

// BEGIN
export default () => {
  const state = {
    form: {
      state: 'filling',
      valid: false,
      errors: {},
      fields: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
    },
  };

  const container = document.querySelector('[data-container="sign-up"]');
  const form = document.querySelector('[data-form="sign-up"]');
  const submit = form.querySelector('[type="submit"]');

  const fieldNames = ['name', 'email', 'password', 'passwordConfirmation'];

  const render = (currentState) => {
    if (currentState.form.state === 'sent') {
      container.innerHTML = 'User Created!';
      return;
    }

    fieldNames.forEach((fieldName) => {
      const input = form.elements[fieldName];

      input.value = currentState.form.fields[fieldName];

      input.classList.remove('is-invalid');

      const nextElement = input.nextElementSibling;
      if (nextElement && nextElement.classList.contains('invalid-feedback')) {
        nextElement.remove();
      }

      if (has(currentState.form.errors, fieldName)) {
        input.classList.add('is-invalid');

        const feedback = document.createElement('div');
        feedback.classList.add('invalid-feedback');
        feedback.textContent = currentState.form.errors[fieldName].message;

        input.after(feedback);
      }
    });

    submit.disabled = !currentState.form.valid || currentState.form.state === 'sending';
  };

  const watchedState = onChange(state, () => {
    render(state);
  });

  fieldNames.forEach((fieldName) => {
    const input = form.elements[fieldName];

    input.addEventListener('input', (event) => {
      watchedState.form.fields[fieldName] = event.target.value;

      const errors = validate(watchedState.form.fields);

      watchedState.form.errors = errors;
      watchedState.form.valid = isEmpty(errors);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const errors = validate(watchedState.form.fields);

    watchedState.form.errors = errors;
    watchedState.form.valid = isEmpty(errors);

    if (!watchedState.form.valid) {
      return;
    }

    watchedState.form.state = 'sending';

    try {
      const url = new URL(routes.usersPath(), window.location.origin);
      await axios.post(url.toString(), watchedState.form.fields);

      watchedState.form.state = 'sent';
    } catch (e) {
      watchedState.form.state = 'filling';
      console.error(errorMessages.network.error);
    }
  });

  render(state);
};
// END
