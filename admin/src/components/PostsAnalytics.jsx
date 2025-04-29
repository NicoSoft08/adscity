import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import Loading from '../customs/Loading';
import { PostsCategoryChart, PostsDistributionPieChart, PostsStatusBarChart, PostsTimelineChart } from './PostsOverviewChart';
import '../styles/PostsAnalytics.scss';

export default function PostsAnalytics({
    posts,
    postsApproved,
    postsRefused,
    postsPending,
    isLoading
}) {
    const { language } = useContext(LanguageContext);

    if (isLoading) return <Loading />

    return (
        <div className="posts-analytics">
            <h2>{language === 'FR' ? 'Analyse des Annonces' : 'Posts Analytics'}</h2>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <PostsStatusBarChart
                        posts={posts}
                        postsApproved={postsApproved}
                        postsRefused={postsRefused}
                        postsPending={postsPending}
                    />
                </div>

                <div className="analytics-card">
                    <PostsDistributionPieChart
                        postsApproved={postsApproved}
                        postsRefused={postsRefused}
                        postsPending={postsPending}
                    />
                </div>

                <div className="analytics-card full-width">
                    <PostsTimelineChart posts={posts} />
                </div>

                <div className="analytics-card full-width">
                    <PostsCategoryChart posts={posts} />
                </div>
            </div>
        </div>
    );
};
