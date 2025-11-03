import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Grid,
  CardActions,
  Chip
} from '@mui/material';
import {
  Book as BookIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Assignment as AssignmentIcon,
  Link as LinkIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import api from '../../utils/api';

const StudentCourses = () => {
  const { studentId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await api.apiGet(`/api/students/${studentId}/courses`);
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to load courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [studentId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      
      {courses.length === 0 ? (
        <Typography>No courses found for your program.</Typography>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course.id || course.courseCode}>
              <CourseCard 
                course={course} 
                studentId={studentId} 
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

const CourseCard = ({ course, studentId }) => {
  const [expanded, setExpanded] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMaterials = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.apiGet(
        `/api/students/${studentId}/courses/${course.id || course.courseCode}`
      );
      setMaterials(data.materials || []);
      setExpanded(true);
    } catch (err) {
      console.error('Failed to load materials:', err);
      alert('Failed to load course materials');
    } finally {
      setLoading(false);
    }
  };

  const getMaterialIcon = (type) => {
    if (!type) return <LinkIcon fontSize="small" />;
    
    const typeLower = type.toLowerCase();
    switch (typeLower) {
      case 'video':
        return <VideoIcon fontSize="small" color="error" />;
      case 'notes':
      case 'note':
        return <ArticleIcon fontSize="small" color="primary" />;
      case 'assignment':
        return <AssignmentIcon fontSize="small" color="secondary" />;
      default:
        return <LinkIcon fontSize="small" />;
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" component="div">
          {course.name || course.courseName}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {course.code || course.courseCode} • {course.credits || 0} Credits
        </Typography>
        
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip 
            size="small" 
            label={`Year ${course.year}`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            size="small" 
            label={course.branch || 'All Branches'} 
            color="secondary" 
            variant="outlined" 
          />
          {course.sections && course.sections.length > 0 && (
            <Chip 
              size="small" 
              label={`Sec ${Array.isArray(course.sections) ? course.sections.join(', ') : course.sections}`} 
              variant="outlined" 
            />
          )}
        </Box>
        
        {course.description && (
          <Typography variant="body2" color="textSecondary" paragraph>
            {course.description}
          </Typography>
        )}
        
        <Button
          variant="outlined"
          size="small"
          onClick={loadMaterials}
          disabled={loading}
          startIcon={expanded ? <ExpandLessIcon /> : <BookIcon />}
          fullWidth
        >
          {loading ? 'Loading...' : expanded ? 'Hide Materials' : 'View Materials'}
        </Button>

        {expanded && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Course Materials:
            </Typography>
            {materials.length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center" py={2}>
                No materials available for this course.
              </Typography>
            ) : (
              <List dense>
                {materials.map((material) => (
                  <React.Fragment key={material.id || material._id}>
                    <ListItem 
                      button 
                      component="a" 
                      href={material.url || '#'} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            {getMaterialIcon(material.type)}
                            <span>{material.title || 'Untitled Material'}</span>
                          </Box>
                        }
                        secondary={material.description || ''}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentCourses;
