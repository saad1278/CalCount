document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calorieForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // منع إرسال النموذج الافتراضي

        const foodName = document.getElementById('foodName').value; // جلب اسم الطعام المدخل
        const weight = parseFloat(document.getElementById('weight').value); // جلب الوزن

        if (weight <= 0) {
            document.getElementById('result').textContent = 'Please enter a valid weight.';
            return;
        }

        // طلب بيانات السعرات الحرارية من Spoonacular API
        const apiKey = '063ecd5e3ffa498d9df76d306566b982'; // ضع مفتاح API الخاص بك هنا
        const url = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(foodName)}&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.results.length > 0) {
                const ingredientId = data.results[0].id; // الحصول على ID الخاص بالمكون

                // طلب بيانات التغذية بناءً على ID المكون
                const nutritionUrl = `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=100&unit=grams&apiKey=${apiKey}`;
                const nutritionResponse = await fetch(nutritionUrl);
                const nutritionData = await nutritionResponse.json();

                const caloriesPer100g = nutritionData.nutrition.nutrients.find(n => n.name === "Calories").amount;
                const totalCalories = (caloriesPer100g / 100) * weight;

                // معدلات حرق السعرات الحرارية (سعرات لكل دقيقة)
                const runningCaloriesPerMinute = 11.4;
                const walkingCaloriesPerMinute = 4;
                const cyclingCaloriesPerMinute = 7;

                // حساب عدد الدقائق اللازمة لكل نشاط
                const runningMinutes = totalCalories / runningCaloriesPerMinute;
                const walkingMinutes = totalCalories / walkingCaloriesPerMinute;
                const cyclingMinutes = totalCalories / cyclingCaloriesPerMinute;

                // عرض النتيجة
                document.getElementById('result').innerHTML = `
                    <p>Total Calories: <span>${totalCalories.toFixed(2)}</span> kcal</p>
                    <p class="activity">To burn these calories, you would need to:</p>
                    <p class="activity">- Run for <span>${runningMinutes.toFixed(2)}</span> minutes (9 km/h)</p>
                    <p class="activity">- Walk for <span>${walkingMinutes.toFixed(2)}</span> minutes (5 km/h)</p>
                    <p class="activity">- Cycle for <span>${cyclingMinutes.toFixed(2)}</span> minutes (15 km/h)</p>
                `;
            } else {
                document.getElementById('result').textContent = 'Food not found. Please try another.';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('result').textContent = 'Error fetching data. Please try again later.';
        }
    });
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

