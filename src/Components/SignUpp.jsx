import input from "./Common/input";
class SignUp extends React.Component {
  render() {
    // fullname, name, forlabel, id, type
    return (
      <div>
        <header>Sign Up</header>
        <section>
          <input
            labelname="Full Name"
            forlabel="name"
            id="name"
            name="fname"
            type="text"
          />
        </section>
      </div>
    );
  }
}

export default SignUp;
