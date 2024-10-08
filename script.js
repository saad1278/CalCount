document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calorieForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // منع الإرسال الافتراضي للنموذج

        const foodName = document.getElementById('foodName').value; // استخدم الاسم المدخل
        const weight = parseFloat(document.getElementById('weight').value);

        // تحقق من أن الوزن صحيح
        if (weight <= 0) {
            document.getElementById('result').textContent = 'Please enter a valid weight.';
            return;
        }

        // استعلام إلى واجهة برمجة التطبيقات للحصول على السعرات الحرارية
        const appId = 'YOUR_APP_ID'; // استبدل بـ App ID الخاص بك
        const appKey = 'YOUR_APP_KEY'; // استبدل بـ App Key الخاص بك
        const url = `https://api.nutritionix.com/v1_1/search/${encodeURIComponent(foodName)}?results=0:1&fields=item_name,nf_calories&appId=${appId}&appKey=${appKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.hits.length > 0) {
                const caloriesPer100g = data.hits[0]._source.nf_calories;
                const totalCalories = (caloriesPer100g / 100) * weight;
                document.getElementById('result').textContent = `Total Calories: ${totalCalories.toFixed(2)} kcal`;
            } else {
                document.getElementById('result').textContent = 'Food not found. Please try another.';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('result').textContent = 'Error fetching data. Please try again later.';
        }
    });

    // البيانات الخاصة بالترجمة
    const translations = {
        en: {
            title: "CalCount",
            description: "Track your daily calories with ease.",
            footer: "Website created by Saad Alshishtawi",
        },
        ar: {
            title: "عداد السعرات الحرارية",
            description: "تتبع السعرات الحرارية اليومية بسهولة.",
            footer: "تصميم: سعد الششتاوي",
        }
    };

    let currentLang = 'en'; // اللغة الحالية الافتراضية هي الإنجليزية

    // دالة لتحديث النصوص حسب اللغة
    function updateLanguage(lang) {
        document.getElementById('title').textContent = translations[lang].title;
        document.getElementById('description').textContent = translations[lang].description;
        document.querySelector('footer p').textContent = translations[lang].footer;
    }

    // تغيير اللغة عند الضغط على الزر
    document.getElementById('lang-toggle').addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        updateLanguage(currentLang);
    });
});
