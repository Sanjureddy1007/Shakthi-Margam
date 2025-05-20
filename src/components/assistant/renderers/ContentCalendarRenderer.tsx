import React, { useState } from 'react';

interface ContentCalendarRendererProps {
  content: string;
  metadata?: any;
  structuredData?: any;
}

interface CalendarWeek {
  weekNumber: number;
  theme: string;
  posts: CalendarPost[];
}

interface CalendarPost {
  day: string;
  contentType: string;
  description: string;
  time?: string;
  hashtags?: string[];
}

const ContentCalendarRenderer: React.FC<ContentCalendarRendererProps> = ({
  content,
  metadata,
  structuredData
}) => {
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const platform = metadata?.platform || 'all';
  
  // Parse the content to extract calendar information
  const parseCalendar = (): CalendarWeek[] => {
    const calendar: CalendarWeek[] = [];
    
    // If we have structured data, use it
    if (structuredData && structuredData.weeks) {
      return structuredData.weeks;
    }
    
    // Otherwise, parse from the text content
    let currentWeek: CalendarWeek | null = null;
    let currentPost: CalendarPost | null = null;
    
    // Split content by lines
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Check if line is a week header
      const weekMatch = line.match(/week\s*(\d+)/i);
      
      if (weekMatch) {
        // If we were building a week, add it to our calendar
        if (currentWeek) {
          // Add the last post if we have one
          if (currentPost) {
            currentWeek.posts.push(currentPost);
            currentPost = null;
          }
          calendar.push(currentWeek);
        }
        
        // Start a new week
        currentWeek = {
          weekNumber: parseInt(weekMatch[1]),
          theme: line.replace(/week\s*\d+/i, '').replace(/[:–-]/g, '').trim(),
          posts: []
        };
      } 
      // Check if line is a day header
      else if (currentWeek && (line.includes('Monday') || line.includes('Tuesday') || line.includes('Wednesday') || 
                line.includes('Thursday') || line.includes('Friday') || line.includes('Saturday') || line.includes('Sunday'))) {
        // If we were building a post, add it to our week
        if (currentPost) {
          currentWeek.posts.push(currentPost);
        }
        
        // Extract day and content type
        const dayMatch = line.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i);
        const contentTypeMatch = line.match(/\((.*?)\)/);
        
        // Start a new post
        currentPost = {
          day: dayMatch ? dayMatch[0] : 'Unknown',
          contentType: contentTypeMatch ? contentTypeMatch[1] : 'Post',
          description: line.replace(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i, '')
                          .replace(/\((.*?)\)/, '')
                          .replace(/[:–-]/g, '')
                          .trim()
        };
      }
      // Check if line contains time information
      else if (currentPost && (line.includes('AM') || line.includes('PM') || line.includes(':00'))) {
        currentPost.time = line.trim();
      }
      // Check if line contains hashtags
      else if (currentPost && line.includes('#')) {
        currentPost.hashtags = line.split(' ')
          .filter(word => word.startsWith('#'))
          .map(tag => tag.trim());
      }
      // Add to current post description
      else if (currentPost) {
        currentPost.description += ' ' + line.trim();
      }
      // Add to current week theme if no post is being built
      else if (currentWeek && !currentPost && line.trim()) {
        currentWeek.theme += ' ' + line.trim();
      }
    }
    
    // Add the last post and week if we have them
    if (currentPost && currentWeek) {
      currentWeek.posts.push(currentPost);
    }
    if (currentWeek) {
      calendar.push(currentWeek);
    }
    
    return calendar;
  };
  
  const calendar = parseCalendar();
  
  // Get color for content type
  const getColorForContentType = (contentType: string): string => {
    const lowerType = contentType.toLowerCase();
    if (lowerType.includes('story')) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    } else if (lowerType.includes('video') || lowerType.includes('reel')) {
      return 'bg-red-100 text-red-800 border-red-300';
    } else if (lowerType.includes('carousel')) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    } else if (lowerType.includes('live')) {
      return 'bg-pink-100 text-pink-800 border-pink-300';
    } else {
      return 'bg-green-100 text-green-800 border-green-300';
    }
  };
  
  // Get color for platform
  const getColorForPlatform = (platform: string): string => {
    const lowerPlatform = platform.toLowerCase();
    switch (lowerPlatform) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'facebook':
        return 'bg-blue-600 text-white';
      case 'linkedin':
        return 'bg-blue-700 text-white';
      case 'twitter':
        return 'bg-blue-400 text-white';
      case 'youtube':
        return 'bg-red-600 text-white';
      case 'all':
      default:
        return 'bg-gray-700 text-white';
    }
  };
  
  return (
    <div className="w-full">
      <div className={`rounded-t-lg p-2 ${getColorForPlatform(platform)}`}>
        <h3 className="text-lg font-semibold">
          {platform === 'all' ? 'Content Calendar' : `${platform} Content Calendar`}
        </h3>
      </div>
      
      {/* Week tabs */}
      <div className="flex mb-4 border-b">
        {calendar.map((week) => (
          <button
            key={week.weekNumber}
            onClick={() => setActiveWeek(week.weekNumber)}
            className={`px-4 py-2 font-medium ${
              activeWeek === week.weekNumber
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Week {week.weekNumber}
          </button>
        ))}
      </div>
      
      {/* Active week content */}
      {calendar.map((week) => (
        <div
          key={week.weekNumber}
          className={activeWeek === week.weekNumber ? 'block' : 'hidden'}
        >
          <div className="mb-4">
            <h4 className="font-medium text-gray-700">Theme: {week.theme}</h4>
          </div>
          
          <div className="space-y-3">
            {week.posts.map((post, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-2 flex justify-between items-center">
                  <span className="font-medium">{post.day}</span>
                  {post.time && <span className="text-sm text-gray-600">{post.time}</span>}
                </div>
                
                <div className="p-3">
                  <div className="flex items-start mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getColorForContentType(post.contentType)}`}>
                      {post.contentType}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-2">{post.description}</p>
                  
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-blue-600 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentCalendarRenderer;
