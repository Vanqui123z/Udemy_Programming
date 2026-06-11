export const codeSnippet = `function authenticate(user) {
  const { email, password } = user;
  
  // Validate credentials
  if (!email || !password) {
    throw new Error('Missing fields');
  }
 
  const hash = bcrypt.hash(password, 12);
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
 
  return { token, user };
}
 
// Middleware guard
export const withAuth = (handler) =>
  async (req, res) => {
    const token = req.headers
      .authorization?.split(' ')[1];
    if (!token) return res.status(401)
      .json({ error: 'Unauthorized' });
    req.user = jwt.verify(token, SECRET);
    return handler(req, res);
  };`;