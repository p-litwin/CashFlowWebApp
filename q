[1mdiff --git a/App/Views/Profile/edit.html b/App/Views/Profile/edit.html[m
[1mindex 07e3857..8a5a723 100644[m
[1m--- a/App/Views/Profile/edit.html[m
[1m+++ b/App/Views/Profile/edit.html[m
[36m@@ -7,17 +7,24 @@[m
 <script>[m
        [m
     $(document).ready(function () {[m
[31m-[m
[32m+[m[32m        var userId = '{{ user.userId }}';[m
         $("#signupForm").validate({[m
             rules: {[m
                 name: 'required',[m
                 email: {[m
                     required: true,[m
                     email: true,[m
[31m-                    remote: '/account/validate-email'[m
[32m+[m[32m                    remote: {[m
[32m+[m[32m                        url: '/account/validate-email',[m
[32m+[m[32m                        data: {[m
[32m+[m[32m                            ignore_id: function() {[m
[32m+[m[32m                                return userId;[m
[32m+[m[32m                            }[m
[32m+[m[32m                        }[m
[32m+[m[32m                    }[m
                 },[m
                 password: {[m
[31m-                    required: false,[m
[32m+[m[32m                    required: true,[m
                     minlength: 6,[m
                     validPassword: true[m
                 }[m
[36m@@ -63,7 +70,7 @@[m
     </div>[m
     <div>[m
         <label for="inputPassword">Password</label>[m
[31m-        <div><input type="password" id="inputPassword" name="password" placeholder="Password"></div>[m
[32m+[m[32m        <div><input type="password" id="inputPassword" name="password" placeholder="Password" required></div>[m
     </div>[m
     <button type="submit">Udpate profile</button><a href="/profile/show">Cancel</a>[m
 </form>[m
