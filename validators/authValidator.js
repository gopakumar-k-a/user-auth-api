export const authValidator = {
  validateRegister: ({ name, email, password, age }) => {
    const errors = [];
    if (!name) errors.push("Name is required");
    if (!email) errors.push("email is required");

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S{8,})/;

    if (!password) {
      errors.push("Password is required");
    } else if (!passwordRegex.test(password)) {
      errors.push(
        "Password must be at least 8 characters long and contain at least one special character"
      );
    }

    if (!age) {
      errors.push("Age is required");
    } else if (parseInt(age) <= 18) {
      errors.push("Age must be a number greater than 18");
    }

    return errors;
  },
  validateLogin: ({ email, password }) => {
    const errors = [];

    if (!email) errors.push("email is required");
    if (!password) errors.push("password is required");
    return errors;
  },
};
