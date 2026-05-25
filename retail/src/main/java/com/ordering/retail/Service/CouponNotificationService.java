package com.ordering.retail.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.ordering.retail.Entity.Coupon;
import com.ordering.retail.Entity.User;
import com.ordering.retail.Repository.UserRepository;

import jakarta.mail.internet.MimeMessage;

@Service
public class CouponNotificationService {

    private static final Logger log = LoggerFactory.getLogger(CouponNotificationService.class);

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final String fromAddress;

    public CouponNotificationService(JavaMailSender mailSender,
            UserRepository userRepository,
            @Value("${spring.mail.username:}") String fromAddress) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.fromAddress = fromAddress;
    }

    public void sendNewCouponAnnouncement(Coupon coupon) {
        List<String> recipients = userRepository.findAll().stream()
                .map(User::getEmail)
                .filter(email -> email != null && !email.isBlank())
                .toList();

        if (recipients.isEmpty()) {
            return;
        }

        for (String recipient : recipients) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
                if (fromAddress != null && !fromAddress.isBlank()) {
                    helper.setFrom(fromAddress);
                }
                helper.setTo(recipient);
                helper.setSubject("New coupon: " + coupon.getCode());
                helper.setText(buildBody(coupon), true);
                mailSender.send(message);
            } catch (Exception ex) {
                log.warn("Failed to send coupon announcement for {} to {}", coupon.getCode(), recipient, ex);
            }
        }
    }

    private String buildBody(Coupon coupon) {
        String offerText = coupon.getType().name().equals("PERCENTAGE")
                ? coupon.getValue().stripTrailingZeros().toPlainString() + "% off"
            : "Flat INR " + coupon.getValue().stripTrailingZeros().toPlainString() + " off";

        return "<!doctype html><html><body style='font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;'>"
                + "<div style='max-width:620px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;'>"
                + "<div style='padding:20px 24px;background:#111827;color:#fff;'><h2 style='margin:0;'>New Coupon Alert</h2></div>"
                + "<div style='padding:24px;'>"
                + "<p>Good news. A new coupon is now live:</p>"
            + "<p style='font-size:24px;font-weight:700;margin:12px 0;color:#1d4ed8;'>" + coupon.getCode() + "</p>"
                + "<p>Offer: <strong>" + offerText + "</strong></p>"
                + "<p>Expiry: <strong>" + coupon.getExpiryDate() + "</strong></p>"
                + "<p style='margin-top:18px;'>Use it in checkout before it expires.</p>"
                + "</div></div></body></html>";
    }
}
