<?php include 'config.php'; ?>
<?php 
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['register'])) {
    $fullName = $conn->real_escape_string($_POST['fullName']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];
    $role = 'buyer'; // Default role

    // In a real app, use password_hash
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $checkEmail = "SELECT email FROM users WHERE email = '$email'";
    $result = $conn->query($checkEmail);

    if ($result->num_rows > 0) {
        $error = "Email already registered";
    } else {
        $sql = "INSERT INTO users (fullName, email, passwordHash, role) VALUES ('$fullName', '$email', '$passwordHash', '$role')";
        if ($conn->query($sql)) {
            $_SESSION['userId'] = $conn->insert_id;
            $_SESSION['fullName'] = $fullName;
            header("Location: profile.php");
            exit;
        } else {
            $error = "Registration failed: " . $conn->error;
        }
    }
}
?>
<?php include 'header.php'; ?>

<main class="max-w-md mx-auto px-4 py-20">
    <div class="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-100 space-y-8">
        <div class="text-center space-y-2">
            <h2 class="text-3xl font-black tracking-tight">Create Account.</h2>
            <p class="text-gray-400 font-medium">Join the Pastimes thrift family.</p>
        </div>

        <?php if(isset($error)): ?>
            <div class="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4">
            <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4">Full Name</label>
                <input type="text" name="fullName" required placeholder="John Doe" class="w-full bg-gray-100 px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-indigo-200 transition-all">
            </div>
            <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4">Email Address</label>
                <input type="email" name="email" required placeholder="you@example.com" class="w-full bg-gray-100 px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-indigo-200 transition-all">
            </div>
            <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4">Password</label>
                <input type="password" name="password" required placeholder="••••••••" class="w-full bg-gray-100 px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-indigo-200 transition-all">
            </div>
            <button type="submit" name="register" class="w-full bg-indigo-600 text-white py-4 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-4">
                Sign Up
            </button>
        </form>

        <div class="text-center text-sm text-gray-400">
            Already have an account? <a href="login.php" class="text-indigo-600 font-bold hover:underline">Log in</a>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
