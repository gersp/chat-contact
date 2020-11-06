export const errorsToForm = form => error => {
  const data = error.response.data;

  Object.keys(form.errors).forEach(k => form.clearError(k));
  const errors = data.errors || [data];

  errors.forEach(e => {
    form.setError(e.args.field || '_', e.error, e.message);
  });
};

export const errorsToObject = error => {
  const data = error.response.data;

  const ret = {};
  const errors = data.args ? data.errors || [data] : [];
  errors.forEach(e => {
    ret[e.args.field || e.args.limit] = e.message;
  });
  return ret;
};

export const valueByName = (obj, name) => {
  const parts = name.split('.');
  let val = obj;
  parts.forEach(p => (val = val[p]));
  return val;
};
