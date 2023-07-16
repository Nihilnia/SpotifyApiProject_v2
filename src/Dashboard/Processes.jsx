export const handleNewTodo = (e) => {
  console.log("New todo..");

  if (e.key == "Enter") {
    const { name, value } = e.target;

    console.log("New todo:");
    console.log(value);
  }
};
