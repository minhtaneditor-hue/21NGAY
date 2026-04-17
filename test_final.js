            <a href="https://www.skool.com/tan-lab-6821/classroom" target="_blank" class="btn-cta" style="padding: 18px 50px; border-radius: 50px; display: inline-block; box-shadow: 0 10px 30px rgba(227, 38, 54, 0.4); text-decoration: none; background: #fff; color: #000; border: none;">VÃ€O TRANG Há»ŒC SKOOL PRO</a>
        </div>
    </div>

    <script>
        // FACEBOOK ADVANCED TRACKING (Scroll, Time, Clicks)
        (function() {
            try {
                if (typeof fbq === 'undefined') {
                    console.log("Facebook Pixel is blocked or not loaded. Tracking disabled.");
                    return;
                }

                // 1. ViewContent on Load
                fbq('track', 'ViewContent', { content_name: '21 Day Landing Page' });

                // 2. ClickButton tracking
                document.addEventListener('click', function(e) {
                    const target = e.target.closest('button, .btn, a.cta-btn');
                    if (target) {
                        fbq('trackCustom', 'ClickButton', {
                            button_text: target.innerText.trim(),
                            button_id: target.id || 'none',
                            page_location: window.location.href
                        });
                    }
                }, true);

                // 3. Scroll Depth Tracking
                const scrollMarks = [25, 50, 75, 100];
                const scrolled = new Set();
                window.addEventListener('scroll', function() {
                    const h = document.documentElement, 
                          b = document.body,
                          st = 'scrollTop',
                          sh = 'scrollHeight';
                    const percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;

                    scrollMarks.forEach(mark => {
                        if (percent >= mark && !scrolled.has(mark)) {
                            scrolled.add(mark);
                            fbq('trackCustom', `ScrollDepth_${mark}_percent`);
                        }
                    });
                }, { passive: true });

                // 4. Time on Page Tracking
                const timeMarks = [10, 30, 60, 120, 300, 600];
                timeMarks.forEach(sec => {
                    setTimeout(() => {
                        fbq('trackCustom', `TimeOnPage_${sec}_seconds`);
                    }, sec * 1000);
                });
            } catch (err) {
                console.error("Tracking Error:", err);
            }
        })();

        let pollingInterval = null;

        function showSuccessModal() {
            closePaymentModal();
            const successModal = document.getElementById("success-modal");
            if (successModal) {
                successModal.style.display = "flex";
            }
        }

        function startStatusPolling(orderId) {
            if (pollingInterval) clearInterval(pollingInterval);
            const pollingBox = document.getElementById("polling-box");
            if (pollingBox) pollingBox.style.display = "block";

            pollingInterval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/check-status?orderId=${orderId}`);
                    const data = await res.json();
                    
                    // Kiá»ƒm tra náº¿u status tráº£ vá» lÃ  PAID (tá»« Google Sheet)
                    if (data.orderStatus === 'PAID') {
                        clearInterval(pollingInterval);
                        showSuccessModal();
                    }
                } catch (e) {
                    console.error("Lá»—i kiá»ƒm tra tráº¡ng thÃ¡i:", e);
                }
            }, 5000); // Check má»—i 5 giÃ¢y
        }

        let currentAmount = 2500000;
        let originalAmount = 2500000;
        let currentPackage = 'VIDEO21DAY';
        let currentOrderId = '';
        let appliedPromo = null;

        const promoCodes = {
            'TANLAB': 500000,
            'GIAM10': 0.1,
            'CHALLENGE': 1000000
        };

        function applyPromoCode() {
            const codeInput = document.getElementById('promo-code').value.trim().toUpperCase();
            const statusEl = document.getElementById('promo-status');
            const discountDisplay = document.getElementById('discount-display');
            
            if (!codeInput) return;

            if (currentPackage === 'COACHING21DAY') {
                statusEl.innerText = "MÃ£ giáº£m giÃ¡ chá»‰ Ã¡p dá»¥ng cho KhÃ³a há»c 21 NgÃ y.";
                statusEl.style.color = "#ff4d4d";
                statusEl.style.display = "block";
                return;
            }

            if (promoCodes[codeInput]) {
                appliedPromo = codeInput;
                const discountValue = promoCodes[codeInput];
                let discountAmount = discountValue < 1 ? originalAmount * discountValue : discountValue;

                currentAmount = originalAmount - discountAmount;
                if (currentAmount < 0) currentAmount = 0;

                statusEl.innerText = `MÃ£ há»£p lá»‡! Báº¡n Ä‘Æ°á»£c giáº£m ${new Intl.NumberFormat('vi-VN').format(discountAmount)} VNÄ.`;
                statusEl.style.color = "#4CAF50";
                statusEl.style.display = "block";

                document.getElementById('old-price').innerText = new Intl.NumberFormat('vi-VN').format(originalAmount) + " VNÄ";
                document.getElementById('new-price').innerText = new Intl.NumberFormat('vi-VN').format(currentAmount) + " VNÄ";
                discountDisplay.style.display = "block";
            } else {
                appliedPromo = null;
                currentAmount = originalAmount;
                statusEl.innerText = "MÃ£ giáº£m giÃ¡ khÃ´ng há»£p lá»‡.";
                statusEl.style.color = "#ff4d4d";
                statusEl.style.display = "block";
                discountDisplay.style.display = "none";
            }
        }

        function selectPackage(amount, pkg) {
            originalAmount = amount;
            currentAmount = amount;
            currentPackage = pkg;
            appliedPromo = null;
            
            document.getElementById('promo-code').value = '';
            document.getElementById('promo-status').style.display = 'none';
            document.getElementById('discount-display').style.display = 'none';
            
            const promoContainer = document.getElementById('promo-container');
            if (pkg === 'COACHING21DAY') {
                promoContainer.style.display = 'none';
            } else {
                promoContainer.style.display = 'block';
            }

            document.getElementById('register-section').scrollIntoView({ behavior: 'smooth' });
        }

        async function handleRegistration(e) {
            if (e) e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerText;
            
            try {
                submitBtn.innerText = "Äang xá»­ lÃ½...";
                submitBtn.disabled = true;

                const registerForm = document.getElementById('register-form');
                const formData = new FormData(registerForm);
                const data = Object.fromEntries(formData.entries());

                const urlParams = new URLSearchParams(window.location.search);
                const utmData = {
                    utm_source: urlParams.get('utm_source') || '',
                    utm_medium: urlParams.get('utm_medium') || '',
                    utm_campaign: urlParams.get('utm_campaign') || '',
                    utm_content: urlParams.get('utm_content') || '',
                    utm_term: urlParams.get('utm_term') || ''
                };

                const phoneStr = data.phone || "0000";
                const randomStr = Math.floor(1000 + Math.random() * 9000);
                currentOrderId = "TAN" + phoneStr.slice(-4) + randomStr;

                data.amount = currentAmount;
                data.package = currentPackage;
                data.orderId = currentOrderId;
                data.promoCode = appliedPromo || 'None';

                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'submit-lead',
                        ...data,
                        utm: utmData,
                        userAgent: navigator.userAgent,
                        eventSourceUrl: window.location.href
                    })
                });

                if (!response.ok) throw new Error("Lá»—i Server");

                if (currentPackage === 'COACHING21DAY') {
                    submitBtn.innerText = "Äang chuyá»ƒn hÆ°á»›ng sang Zalo...";
                    setTimeout(() => {
                        window.open('https://zalo.me/0962255861', '_blank');
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }, 1000);
                } else {
                    preparePaymentModal(currentAmount, currentOrderId);
                    showPaymentModal();
                    startStatusPolling(currentOrderId);
                    registerForm.style.opacity = '0.3';
                    registerForm.style.pointerEvents = 'none';
                    submitBtn.innerText = "Äang chá» thanh toÃ¡n...";
                }
            } catch(error) {
                console.error("Lá»—i:", error);
                submitBtn.innerText = "Lá»—i há»‡ thá»‘ng!";
                submitBtn.disabled = false;
            }
            return false;
        }

        async function sendPaymentConfirmation() {
            const btn = document.getElementById('confirm-payment-btn');
            btn.innerText = "Äang gá»­i bÃ¡o cÃ¡o...";
            btn.disabled = true;

            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'confirm-payment',
                        fullname: document.getElementById('fullname').value,
                        phone: document.getElementById('phone').value,
                        email: document.getElementById('email').value,
                        orderId: currentOrderId,
                        amount: currentAmount
                    })
                });

                if (response.ok) {
                    btn.innerText = "ÄÃ£ gá»­i thÃ´ng bÃ¡o!";
                    showSuccessModal();
                } else {
                    throw new Error("Gá»­i tháº¥t báº¡i");
                }
            } catch (error) {
                console.error("Lá»—i xÃ¡c nháº­n:", error);
                btn.innerText = "Lá»—i gá»­i, hÃ£y thá»­ láº¡i!";
                btn.disabled = false;
            }
        }

        function preparePaymentModal(amount, description) {
            document.getElementById("payment-amount").innerText = new Intl.NumberFormat('vi-VN').format(amount) + " VNÄ";
            document.getElementById("payment-desc").innerText = description;
            const qrUrl = "https://qr.sepay.vn/img?acc=221898279&bank=ACB&amount=" + amount + "&des=" + description + "&template=compact";
            document.getElementById("vietqr-qr").src = qrUrl;
        }

        function showPaymentModal() {
            document.getElementById("payment-modal").style.display = "flex";
        }

        function closePaymentModal() {
            document.getElementById("payment-modal").style.display = "none";
        }

        function showPolicy(type) {
            // Hiá»ƒn thá»‹ policy Ä‘Æ¡n giáº£n
            alert("Äang cáº­p nháº­t ná»™i dung chÃ­nh sÃ¡ch...");
        }

        function closePolicy() {
            document.getElementById("policy-modal").style.display = "none";
        }

        // Smooth scroll
        document.querySelectorAll("a[href^='#']").forEach(btn => {
            btn.addEventListener("click", function(event) {
                event.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if(target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        window.onclick = function(event) {
            if (event.target == document.getElementById("payment-modal")) {
                closePaymentModal();
            }
        }
    </script>
