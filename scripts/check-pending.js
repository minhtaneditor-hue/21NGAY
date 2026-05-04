
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbznXhr4jeHaz3UCZ_BtdzVGfdQcCBV_LHPTa-I7EyRkb0oZGHIeA-N72FjsjEbDiDtS/exec";

async function checkData() {
    console.log("Fetching data from Google Sheet...");
    try {
        const response = await fetch(GOOGLE_SHEET_URL, { method: 'GET', redirect: 'follow' });
        const result = await response.json();
        
        if (result.status === 'ok' && result.data) {
            const pendingCustomers = result.data.filter(c => c.status === 'PENDING');
            console.log(`Total customers: ${result.data.length}`);
            console.log(`Pending customers: ${pendingCustomers.length}`);
            
            pendingCustomers.forEach((c, index) => {
                console.log(`${index + 1}. ${c.fullname} - ${c.email} (${c.phone}) - Registered: ${c.timestamp}`);
            });
        } else {
            console.error("Failed to fetch data or data is empty:", result);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

checkData();
