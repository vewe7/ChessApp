export default ({ component: C, appProps, ...rest }) => {
  return (
    <Route
        {...rest}
        render={props =>
        !appProps.isAuthenticated
            ? <C {...props} {...appProps} />
            : <Redirect to="/login" />}
    />
  );
}