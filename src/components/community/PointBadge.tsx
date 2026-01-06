"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Trophy } from 'lucide-react';

export default function PointBadge() {
    const [stats, setStats] = useState({ level: 1, points: 0 });
    const supabase = createClient();

    useEffect(() => {
        async function fetchStats() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('level, points')
                    .eq('id', user.id)
                    .single();

                if (data) setStats(data);
            }
        }
        fetchStats();
    }, []);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: '#27272a',
            borderRadius: '20px',
            fontSize: '0.85rem',
            color: 'white',
            border: '1px solid #3f3f46'
        }}>
            <Trophy size={14} color="#eab308" />
            <span style={{ fontWeight: 700, color: '#eab308' }}>Lv.{stats.level}</span>
            <span style={{ color: '#71717a' }}>|</span>
            <span>{stats.points.toLocaleString()} P</span>
        </div>
    );
}
