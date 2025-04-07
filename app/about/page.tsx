export default function About() {
  return (
    <div className="prose prose-indigo mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
      <div className="bg-white rounded-lg shadow-xl p-8">
        <p className="mb-4">
          Welcome to EMI Calculator, your trusted companion in making informed financial decisions. 
          Our calculator helps you plan your loans and financial commitments with precision and ease.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">What is EMI?</h2>
        <p className="mb-4">
          EMI (Equated Monthly Installment) is the fixed amount that a borrower pays to the lender 
          on a specified date each month. EMI consists of both principal and interest components.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">How We Help</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Calculate your monthly EMI based on loan amount, interest rate, and tenure</li>
          <li>Determine loan tenure based on your preferred EMI amount</li>
          <li>Help you make better financial planning decisions</li>
          <li>Provide a user-friendly interface for quick calculations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
        <p>
          Our mission is to simplify financial planning for everyone by providing easy-to-use tools 
          that help make informed decisions about loans and investments.
        </p>
      </div>
    </div>
  );
}
