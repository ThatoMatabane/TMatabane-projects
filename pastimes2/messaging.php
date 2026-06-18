<?php include 'config.php'; ?>
<?php
if (!isset($_SESSION['userId'])) {
    header("Location: login.php");
    exit;
}

$userId = $_SESSION['userId'];
$sellerId = isset($_GET['sellerId']) ? intval($_GET['sellerId']) : 0;
$productId = isset($_GET['productId']) ? intval($_GET['productId']) : 0;

// Sending a message
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['sendMessage'])) {
    $content = $conn->real_escape_string($_POST['content']);
    $receiverId = intval($_POST['receiverId']);
    $pId = intval($_POST['productId']);
    
    $insertSql = "INSERT INTO messages (senderId, receiverId, productId, content) VALUES ($userId, $receiverId, $pId, '$content')";
    $conn->query($insertSql);
    header("Location: messaging.php?sellerId=$receiverId&productId=$pId");
    exit;
}

// Fetch conversations
$convSql = "SELECT DISTINCT 
                CASE WHEN senderId = $userId THEN receiverId ELSE senderId END as otherUserId,
                (SELECT fullName FROM users WHERE userId = otherUserId) as otherUserName
            FROM messages 
            WHERE senderId = $userId OR receiverId = $userId";
$convResult = $conn->query($convSql);

// Fetch messages for current chat
$messages = [];
if ($sellerId > 0) {
    $msgSql = "SELECT m.*, u.fullName as senderName FROM messages m 
               JOIN users u ON m.senderId = u.userId
               WHERE (m.senderId = $userId AND m.receiverId = $sellerId) 
               OR (m.senderId = $sellerId AND m.receiverId = $userId)
               ORDER BY m.createdAt ASC";
    $messages = $conn->query($msgSql);
}
?>
<?php include 'header.php'; ?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid md:grid-cols-3 gap-8 bg-darkCard rounded-[3rem] border border-darkBorder overflow-hidden min-h-[700px]">
        <!-- Inbox List -->
        <div class="border-r border-darkBorder flex flex-col h-full bg-darkBg/40">
            <div class="p-8 border-b border-darkBorder">
                <h2 class="text-2xl font-black tracking-tight text-white">Messages.</h2>
            </div>
            <div class="flex-1 overflow-y-auto">
                <?php if($convResult && $convResult->num_rows > 0): ?>
                    <?php while($conv = $convResult->fetch_assoc()): ?>
                        <a href="messaging.php?sellerId=<?php echo $conv['otherUserId']; ?>" class="block p-6 hover:bg-darkCard transition-all <?php echo ($sellerId == $conv['otherUserId']) ? 'bg-indigo-500/5 border-l-4 border-indigo-500' : ''; ?>">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center font-bold text-indigo-400">
                                    <?php echo strtoupper(substr($conv['otherUserName'], 0, 1)); ?>
                                </div>
                                <div class="font-bold text-gray-200"><?php echo $conv['otherUserName']; ?></div>
                            </div>
                        </a>
                     <?php endwhile; ?>
                <?php else: ?>
                    <div class="p-8 text-center text-gray-500 font-medium">No messages yet.</div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Chat Window -->
        <div class="md:col-span-2 flex flex-col h-full bg-darkCard">
            <?php if ($sellerId > 0): 
                $otherUser = $conn->query("SELECT fullName FROM users WHERE userId = $sellerId")->fetch_assoc();
            ?>
                <div class="p-6 border-b border-darkBorder flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center font-bold text-indigo-400">
                            <?php echo strtoupper(substr($otherUser['fullName'], 0, 1)); ?>
                        </div>
                        <div class="font-bold text-lg text-white"><?php echo $otherUser['fullName']; ?></div>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col">
                    <?php if ($messages && $messages->num_rows > 0): ?>
                        <?php while($msg = $messages->fetch_assoc()): 
                            $isMine = ($msg['senderId'] == $userId);
                        ?>
                            <div class="flex <?php echo $isMine ? 'justify-end' : 'justify-start'; ?>">
                                <div class="max-w-[80%] <?php echo $isMine ? 'bg-indigo-600 text-white rounded-t-2xl rounded-l-2xl' : 'bg-[#1e222d] border border-darkBorder text-gray-200 rounded-t-2xl rounded-r-2xl'; ?> p-4 text-sm font-medium shadow-sm">
                                    <?php echo $msg['content']; ?>
                                    <div class="text-[8px] opacity-60 mt-1 uppercase font-bold tracking-widest"><?php echo date('H:i', strtotime($msg['createdAt'])); ?></div>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <div class="flex-1 flex items-center justify-center text-gray-500 italic">Start the conversation...</div>
                    <?php endif; ?>
                </div>

                <div class="p-6 border-t border-darkBorder bg-darkBg/20">
                    <form method="POST" class="flex gap-4">
                        <input type="hidden" name="receiverId" value="<?php echo $sellerId; ?>">
                        <input type="hidden" name="productId" value="<?php echo $productId; ?>">
                        <input type="text" name="content" required placeholder="Type your message..." class="flex-1 bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-500 px-6 py-4 rounded-full text-sm focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none">
                        <button type="submit" name="sendMessage" class="bg-indigo-600 text-white p-4 rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-650/20">
                            <i data-lucide="send" class="w-5 h-5"></i>
                        </button>
                    </form>
                </div>
            <?php else: ?>
                <div class="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4 bg-darkBg/10">
                    <div class="w-20 h-20 bg-darkBg border border-darkBorder rounded-full flex items-center justify-center">
                        <i data-lucide="message-square" class="w-10 h-10 text-gray-500"></i>
                    </div>
                    <div class="space-y-1">
                        <h3 class="text-xl font-bold text-white">Select a chat.</h3>
                        <p class="text-gray-400 text-sm max-w-xs mx-auto">Choose a conversation from the left or message a seller from the shop to get started.</p>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
