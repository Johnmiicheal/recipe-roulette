
const Header = () => {
  return (
    <div className="text-center py-16" style={{ backgroundImage: "url('/assets/dotted-mask.png')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "70%" }}>
      <style>
        {`
          @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
          }
          .rotate {
        animation: rotate 10s linear infinite;
          }
        `}
      </style>
      <img src="/assets/cake.svg" alt="Cake" className="w-24 h-24 mx-auto mb-6 rotate" />
      <style>
        {`
          @font-face {
        font-family: 'Sughoiy';
        src: url('/fonts/Sughoiy.woff') format('woff');
        font-weight: normal;
        font-style: normal;
          }
          .custom-font {
        font-family: 'Sughoiy', sans-serif;
          }
        `}
      </style>
      <h1 className="text-4xl font-bold mb-6 custom-font">What would you like to cook?</h1>
      <p className="text-xl text-gray-600">Create meal plans, find recipes for your favourite dishes.</p>
    </div>
  );
};

export default Header;