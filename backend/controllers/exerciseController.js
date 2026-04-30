import axios from 'axios';

// @desc    Proxy fetch exercises from ExerciseDB
// @route   GET /api/exercises
// @access  Public
export const getExercises = async (req, res) => {
    try {
        console.log('Fetching from ExerciseDB OSS...');
        const response = await axios.get('https://oss.exercisedb.dev/api/v1/exercises', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log('ExerciseDB Status:', response.status);
        
        const data = Array.isArray(response.data) ? response.data : (response.data.exercises || response.data.data || []);
        console.log('Final Data Length:', data.length);
        res.json(data);
    } catch (error) {
        console.error('ExerciseDB Proxy Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch exercises from satellite array' });
    }
};
