const STATUS_MAP = {
  loading: {
    message: '⏳ Loading...',
    classes: 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse',
  },

  200: {
    message: '✅ Changes saved successfully!',
    classes: 'bg-green-50 border-green-200 text-green-700',
  },

  201: {
    message: '✅ Created successfully!',
    classes: 'bg-green-50 border-green-200 text-green-700',
  },

  204: {
    message: '✅ Operation completed.',
    classes: 'bg-green-50 border-green-200 text-green-700',
  },

  400: {
    message: '❌ Bad request.',
    classes: 'bg-red-50 border-red-200 text-red-700',
  },

  401: {
    message: '🔒 Unauthorized.',
    classes: 'bg-red-50 border-red-200 text-red-700',
  },

  403: {
    message: '🚫 Forbidden.',
    classes: 'bg-red-50 border-red-200 text-red-700',
  },

  404: {
    message: '❓ Resource not found.',
    classes: 'bg-red-50 border-red-200 text-red-700',
  },

  500: {
    message: '💥 Server error. Try again later.',
    classes: 'bg-red-50 border-red-200 text-red-700',
  },

  defaultError: {
    message: '❌ Something went wrong.',
    classes: 'bg-red-50 border-red-200 text-red-700',
  },
};

// sample ->
// <Message
//   status={400}
//   overrides={{
//     400: {
//       message: '⚠️ Form validation failed.',
//       classes: 'bg-yellow-50 border-yellow-200 text-yellow-700',
//     },
//   }}
// />

const Message = ({
  status,
  overrides = {},
}) => {
  if (status === false) return null;

  const baseClasses =
    'inline-block px-4 py-2 rounded-lg text-sm font-medium transition-opacity duration-300 ease-in-out shadow-sm border max-w-full';

  // Resolve config
  const config =
    overrides[status] ||
    STATUS_MAP[status] ||
    STATUS_MAP.defaultError;

  const message =
    typeof config.message === 'function'
      ? config.message(status)
      : config.message;

  return (
    <div className="overflow-hidden text-center" role="alert">
      <span className={`${baseClasses} ${config.classes}`}>
        {message}
      </span>
    </div>
  );
};

export default Message;
