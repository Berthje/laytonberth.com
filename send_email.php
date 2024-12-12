<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (!empty($_POST["honeypot"])) {
    echo json_encode(['error' => 'Spam detected.']);
    exit;
  }

  // Function to sanitize input using htmlspecialchars
  function sanitizeInput($input)
  {
    return htmlspecialchars(trim($input));
  }

  // Function to convert line breaks to <br> tags
  function convertLineBreaks($input)
  {
    return nl2br($input);
  }

  // Validate and sanitize form data
  $name = sanitizeInput($_POST["name"]);
  $email = sanitizeInput($_POST["email"]);
  $subject = sanitizeInput($_POST["subject"]);
  $message = sanitizeInput($_POST["message"]);
  $message = convertLineBreaks($message);

  // Validate email format
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Invalid email format.']);
    exit;
  }

  // Compose the email
  $to = "info@laytonberth.com"; // Replace with your Roundcube email address
  $headers = "From: $name <$email>" . "\r\n";
  $headers .= "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";

  $emailSubject = "New message from your contact form!";

  // HTML template
  $emailBody = '
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Email Template</title>
    <style>
      /* Inline CSS styles */
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .content {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        color: #777777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>You received a message!</h1>
      </div>
      <div class="content">
        <h2>' . $name . ' <span style="color: #777777; font-size: 0.8rem;">' . $email . '</span></h2>
        <h4>' . $subject . '</h4>
        <hr>
        <p>' . $message . '</p>
      </div>
      <div class="footer">
        <p>sent to www.laytonberth.com at ' . date("d-m-Y H:i:s") . '</p>
      </div>
    </div>
  </body>
  </html>';

  // Send the email
  $result = mail($to, $emailSubject, $emailBody, $headers);

  // Check if the email was sent successfully
  if ($result) {
    header("Location: /");
  } else {
    echo json_encode(['error' => 'Sorry, there was an error sending your message.', 'countdown' => 5]);
    header("Refresh: 1; URL=laytonberth.com");
    exit;
  }
} else {
  // Redirect to laytonberth.com
  header("Location: laytonberth.com");
  exit;
}
