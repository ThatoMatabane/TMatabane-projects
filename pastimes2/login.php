<?php include 'config.php'; ?>
<?php 
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])) {
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];
    
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['passwordHash'])) {
            $_SESSION['userId'] = $user['userId'];
            $_SESSION['fullName'] = $user['fullName'];
            $_SESSION['role'] = $user['role'];
            header("Location: profile.php");
            exit;
        } else {
            $error = "Invalid password";
        }
    } else {
        $error = "Email not found";
    }
}
?>
<?php include 'header.php'; ?>

<main class="max-w-md mx-auto px-4 py-20">
    <div class="bg-darkCard p-10 rounded-[3rem] border border-darkBorder space-y-8 shadow-2xl">
        <div class="text-center space-y-2">
            <h2 class="text-3xl font-black tracking-tight text-white">Login.</h2>
            <p class="text-gray-400 font-medium">Join our thrift community.</p>
        </div>

        <?php if(isset($error)): ?>
            <div class="bg-red-950/40 border border-red-900/50 text-red-200 p-4 rounded-2xl text-sm font-medium">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4">
            <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4">Email Address</label>
                <input type="email" name="email" required placeholder="you@example.com" class="w-full bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-600 px-6 py-4 rounded-full focus:ring-2 focus:ring-indigo-550/40 outline-none transition-all">
            </div>
            <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4">Password</label>
                <input type="password" name="password" required placeholder="••••••••" class="w-full bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-650 px-6 py-4 rounded-full focus:ring-2 focus:ring-indigo-550/40 outline-none transition-all">
            </div>
            <button type="submit" name="login" class="w-full bg-indigo-600 text-white py-4 rounded-full font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-605/20 mt-4">
                Continue
            </button>
        </form>

        <div class="text-center text-sm text-gray-400">
            Don't have an account? <a href="register.php" class="text-indigo-400 font-bold hover:text-indigo-300 hover:underline">Sign up</a>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
