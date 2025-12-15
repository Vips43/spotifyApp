const searchState = {
  query: "",
  type: ""
};



export function getValue(query, type) {
  searchState.query = query;
  searchState.type = type;
}


export function passValue() {
  return { ...searchState };
}