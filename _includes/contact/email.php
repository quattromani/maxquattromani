<?php
if(isset($_POST['submit'])){
  $send_from = "contact-us@terracareassociates.com";
  $from = $_POST['email'];
  $first_name = $_POST['first-name'];
  $last_name = $_POST['last-name'];
  $phone = $_POST['phone'];
  $subject = "Terracare Contact Form";
  $message1 = "Dear " . $first-name . ",
  <br/><br/>
  Thank you.
  <br/><br/>
  We\'ll be in touch.
  <br/><br/>
  If you have any questions, please contact Cristin Tarr.";

  $headers = "From: " . strip_tags($send_from) . "\r\n";
  $headers .= "Reply-To: ". "ctarr@myterracare.net" . "\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

  mail($from,$subject,$message1,$headers);
  header("Location: /thank-you");
}
?>
