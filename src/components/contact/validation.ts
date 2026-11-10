const _isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  const sanitized = input.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
  return sanitized.trim(); // Remove leading and trailing whitespace
};
export const evaluateInputs = (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  let errors = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

   // Sanitize inputs
   name = sanitizeInput(name);
   email = sanitizeInput(email);
   subject = sanitizeInput(subject);
   message = sanitizeInput(message);

  if (name.length < 2) {
    errors.name += "Please enter a valid name.";
  }
  if (!_isValidEmail(email)) {
    errors.email += "Email is not valid.";
  }
  if (subject.length < 4) {
    errors.subject += "Subject is too short.";
  }
  if (message.length < 10) {
    errors.message += "Hey, don't be shy. Tell me more.";
  }
  return errors;
};
