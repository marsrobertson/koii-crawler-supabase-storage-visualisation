const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ireslafhhzqhpflmbkno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZXNsYWZoaHpxaHBmbG1ia25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk4NTUzNjIsImV4cCI6MjAzNTQzMTM2Mn0.L8s5chPGTM28R27dCvB2GxooAHsRz59eevq-uV35q5g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addSubmission(nodeId, roundId, mostViewedTitle, mostViewedLink, mostReadTitle, mostReadLink, signature) {
    const { data, error } = await supabase
        .from('submissions')
        .insert([{ node_id: nodeId, round_id: roundId, most_viewed: mostViewedTitle, most_viewed_link: mostViewedLink, most_read: mostReadTitle, most_read_link: mostReadLink, signature }]);

    if (error) {
        console.error('Error inserting submission:', error);
    } else {
        console.log('Submission added:', data);
    }
}

module.exports = {
    addSubmission: addSubmission
}