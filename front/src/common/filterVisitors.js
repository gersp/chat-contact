import { SystemFieldType } from 'api/api';

const checkField = (field, p) => {
  if (!field || !p) {
    return false;
  }

  field = field.toString();

  if (p.charAt(0).toUpperCase() === p.charAt(0)) {
    return field.toLowerCase().startsWith(p.toLowerCase()) || field.toLowerCase().indexOf(' ' + p.toLowerCase()) !== -1;
  } else {
    return field.toLowerCase().indexOf(p.toLowerCase()) !== -1;
  }
};

const filter = (originalVisitors, search, group, isReception) => {
  let visitors = originalVisitors;

  if (isReception && (!search || search.length < 3)) {
    return [];
  }

  if (!(!group || group === '')) {
    visitors = originalVisitors.filter(e => e.groupId === group);
  }

  if (!search || search === '') {
    return visitors;
  }

  if (search.startsWith('code:')) {
    search = search.substr(5);
    const res = visitors.filter(e => {
      return e.qrToken === search;
    });
    if (res.length === 1) {
      return res;
    }
  }

  const systemFields = Object.values(SystemFieldType).map(field => (field === 'group' ? 'groupName' : field));

  // Разбиваем search запрос на части и ищем совпадения в разных полях
  const parts = search.split(' ').filter(e => e !== '');
  return visitors.filter(visitor => {
    let fieldValues = systemFields.map(systemField => visitor[systemField]);
    fieldValues = fieldValues.concat(Object.values(visitor.extended || {}));
    for (let field of fieldValues) {
      for (let part of parts) {
        if (checkField(field, part)) {
          return true;
        }
      }
    }
    return false;
  });
};

export default filter;
