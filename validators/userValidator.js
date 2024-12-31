export const userValidator = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateCreate: ({ name, email, age }) => {
    const errors = [];

    if (!name) errors.push("Name is required");

    if (!email) {
      errors.push("Email is required");
    } else if (!userValidator.isValidEmail(email)) {
      errors.push("Invalid email format");
    }

    if (!age) {
      errors.push("Age is required");
    } else if (parseInt(age) <= 18) {
      errors.push("Age must be a number greater than 18");
    }

    return errors;
  },

  validateUpdate: (updates) => {
    const errors = [];

    if (updates.email && !userValidator.isValidEmail(updates.email)) {
      errors.push("Invalid email format");
    }

    if (updates.age && parseInt(updates.age) <= 18) {
      errors.push("Age must be a number greater than 18");
    }

    return errors;
  },
};
