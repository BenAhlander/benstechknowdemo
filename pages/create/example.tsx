type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Pet = {
  id: number;
  name: string;
  breed: string;
  age: number;
};

export default function Example({ user, pet }: { user: User; pet: Pet }) {
  return (
    <div>
      <h1>Welcome, {user.firstName}</h1>
      <p>{`My favorite pet is ${pet.breed} and his is ${pet.age} years old`}</p>
    </div>
  );
}
