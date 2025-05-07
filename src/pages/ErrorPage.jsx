import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <div>
      <h1>404: Page not found</h1>
      <h1>Whoops! You navigated to the wrong page</h1>
    </div>
  );
};

export default ErrorPage;
