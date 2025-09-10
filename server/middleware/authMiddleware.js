import User from "../models/User.js";


// Middleware to check if user is authenticated
export const protect = async (req, res, next)=>{
          try {
                    console.log('Auth middleware - req.auth:', req.auth);
                    const {userId} = req.auth;
                    console.log('Auth middleware - userId:', userId);
                    if(!userId) {
                              console.log('Auth middleware - no userId found');
                              return res.status(401).json({success: false, message: "Not authenticated"})
                    }

                    let user = await User.findById(userId);
                    console.log('Auth middleware - user found:', user);
                    if(!user) {
                              console.log('Auth middleware - user not found in database, provisioning');
                              const claims = req.auth?.sessionClaims || {};
                              const email = claims.email || claims.email_address || '';
                              const username = claims.username || (email ? email.split('@')[0] : (userId || 'user').slice(0,8));
                              const image = claims.image || claims.picture || 'https://avatars.githubusercontent.com/u/1?v=4';
                              try {
                                        user = await User.create({ _id: userId, username, email, image, role: 'user', recentSearchedCities: [] });
                              } catch (e) {
                                        console.error('Auth middleware - user provisioning failed:', e);
                                        return res.status(401).json({success: false, message: 'User not found and provisioning failed'})
                              }
                    }

                    req.user = user;
                    console.log('Auth middleware - req.user set:', req.user?._id);
                    next()
          } catch (error) {
                    console.error('Auth middleware error:', error);
                    return res.status(500).json({success: false, message: "Authentication error"})
          }
}
