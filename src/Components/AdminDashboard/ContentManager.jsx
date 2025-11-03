import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider
} from '@mui/material';
import { Delete as DeleteIcon, UploadFile as UploadFileIcon, Link as LinkIcon, Notes as NotesIcon, Movie as MovieIcon, Subject as SubjectIcon, MenuBook as MenuBookIcon, Article as ArticleIcon, Campaign as CampaignIcon } from '@mui/icons-material';
import api from '../../utils/apiClient';

const ContentManager = () => {
  const [activeYear, setActiveYear] = useState('1');
  const [activeBranch, setActiveBranch] = useState('CSE');
  const [selectedSections, setSelectedSections] = useState([]);
  const [activeContentType, setActiveContentType] = useState('notes');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    semester: '',
    size: '',
    duration: '',
    views: '',
    url: '',
    description: '',
    examYear: '',
    examType: '',
    solutionUrl: '',
    questionFile: null,
    solutionFile: null,
    message: '' // For announcements
  });

  const years = ['1', '2', '3', '4'];
  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  const sections = Array.from({ length: 20 }, (_, i) => String.fromCharCode(65 + i)); // A..T
  const contentTypes = [
    { id: 'notes', label: 'Notes', icon: <NotesIcon /> },
    { id: 'videos', label: 'Videos', icon: <MovieIcon /> },
    { id: 'subjects', label: 'Subjects', icon: <SubjectIcon /> },
    { id: 'syllabus', label: 'Syllabus', icon: <MenuBookIcon /> },
    { id: 'previousQuestions', label: 'Previous Papers', icon: <ArticleIcon /> },
    { id: 'modelPapers', label: 'Model Papers', icon: <ArticleIcon /> },
    { id: 'announcements', label: 'Announcements', icon: <CampaignIcon /> },
  ];

  const handleContentTypeChange = (type) => {
    setActiveContentType(type);
    resetForm();
  };

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.apiGet(`/api/materials?year=${activeYear}&branch=${activeBranch}`);
      setMaterials(res || []);
    } catch (err) {
      console.error('Failed to load materials', err);
      setMaterials([]);
    }
    setLoading(false);
  }, [activeYear, activeBranch]);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      const file = files[0];

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only PDF, JPG, or PNG files.');
        e.target.value = '';
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    }
  };

  const toggleSection = (sec) => {
    setSelectedSections(prev => prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAnnouncement = activeContentType === 'announcements';
    if (!formData.title.trim() || (!isAnnouncement && !formData.subject.trim())) {
      alert('Please fill in required fields (Title and Subject)');
      return;
    }

    if (['previousQuestions', 'modelPapers'].includes(activeContentType)) {
      if (!formData.questionFile && !formData.url) {
        alert('Please upload a file or provide a URL');
        return;
      }
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append('year', activeYear);
      formDataToSend.append('section', selectedSections.join(','));
      formDataToSend.append('subject', formData.subject.trim());
      formDataToSend.append('type', activeContentType);
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('branch', activeBranch);

      // Add optional fields based on content type
      if (formData.url) formDataToSend.append('link', formData.url);
      if (formData.message) formDataToSend.append('message', formData.message);
      if (formData.examYear) formDataToSend.append('dueDate', formData.examYear);
      if (formData.examType) formDataToSend.append('message', formData.examType);

      // Add file if exists
      if (formData.questionFile) {
        formDataToSend.append('file', formData.questionFile);
      }

      // Add advance courses specific fields
      if (activeContentType === 'advance-courses') {
        formDataToSend.append('course', formData.subject.trim());
        formDataToSend.append('subject', 'Advance Courses');
        formDataToSend.append('year', 'All');
        formDataToSend.append('section', 'All');
      }

      await api.apiPost('/api/materials', formDataToSend);

      alert(`${activeContentType.charAt(0).toUpperCase() + activeContentType.slice(1)} added successfully for Year ${activeYear}!`);
      resetForm();
      loadMaterials();
    } catch (err) {
      console.error('Failed to upload material', err);
      alert('Failed to upload material. Please try again.');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      semester: '',
      size: '',
      duration: '',
      views: '',
      url: '',
      description: '',
      examYear: '',
      examType: '',
      solutionUrl: '',
      questionFile: null,
      solutionFile: null,
      message: ''
    });

    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = '');
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.apiDelete(`/api/materials/${itemId}`);
        alert('Item deleted successfully!');
        loadMaterials();
      } catch (err) {
        console.error('Failed to delete material', err);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  const renderForm = () => {
    const isAnnouncement = activeContentType === 'announcements';
    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={isAnnouncement ? 12 : 6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder={`Enter ${activeContentType} title`}
              variant="outlined"
            />
          </Grid>

          {!isAnnouncement && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Enter subject name"
                variant="outlined"
              />
            </Grid>
          )}

        {!isAnnouncement && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Semester</InputLabel>
                <Select name="semester" value={formData.semester} onChange={handleInputChange} label="Semester">
                  <MenuItem value="1">Semester 1</MenuItem>
                  <MenuItem value="2">Semester 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
        )}

        {activeContentType === 'notes' && (
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="File Size" name="size" value={formData.size} onChange={handleInputChange} placeholder="e.g., 2.5 MB" variant="outlined" />
          </Grid>
        )}

        {activeContentType === 'videos' && (
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Duration" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g., 45 min" variant="outlined" />
          </Grid>
        )}

        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth>
            <Typography component="legend" variant="subtitle1" sx={{ mb: 1 }}>Assign to Sections</Typography>
            <FormGroup row sx={{ 
              border: '1px solid #ccc', 
              borderRadius: 1, 
              p: 1, 
              maxHeight: '120px', 
              overflowY: 'auto' 
            }}>
              {sections.map(sec => (
                <FormControlLabel
                  key={sec}
                  control={<Checkbox checked={selectedSections.includes(sec)} onChange={() => toggleSection(sec)} name={sec} />}
                  label={sec}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        {isAnnouncement && (
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={4} label="Message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Enter your announcement..." variant="outlined" />
          </Grid>
        )}

        {activeContentType === 'videos' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Video URL" name="url" type="url" value={formData.url} onChange={handleInputChange} placeholder="https://youtube.com/..." variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Initial Views" name="views" value={formData.views} onChange={handleInputChange} placeholder="e.g., 1.2K" variant="outlined" />
            </Grid>
          </>
        )}

        {(['subjects', 'syllabus'].includes(activeContentType)) && (
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Description" name="description" value={formData.description} onChange={handleInputChange} placeholder={`Enter ${activeContentType} description`} variant="outlined" />
          </Grid>
        )}

        {(['previousQuestions', 'modelPapers'].includes(activeContentType)) && (
          <>
            <Grid item xs={12}>
              <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
                Upload Question File *
                <input type="file" name="questionFile" hidden onChange={handleFileChange} />
              </Button>
              {formData.questionFile && <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>{formData.questionFile.name}</Typography>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Exam Year" name="examYear" value={formData.examYear} onChange={handleInputChange} placeholder="e.g., 2023" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Exam Type</InputLabel>
                <Select name="examType" value={formData.examType} onChange={handleInputChange} label="Exam Type">
                  <MenuItem value=""><em>Select Type</em></MenuItem>
                  <MenuItem value="Final Exam">Final Exam</MenuItem>
                  <MenuItem value="Mid Term">Mid Term</MenuItem>
                  <MenuItem value="Quiz">Quiz</MenuItem>
                  <MenuItem value="Internal">Internal Assessment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                Upload Solution (Optional)
                <input type="file" name="solutionFile" hidden onChange={handleFileChange} />
              </Button>
              {formData.solutionFile && <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>{formData.solutionFile.name}</Typography>}
            </Grid>
          </>
        )}

        <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : `Add ${activeContentType}`}
          </Button>
          <Button type="button" variant="outlined" onClick={resetForm}>
            Reset
          </Button>
        </Grid>
        </Grid>
      </form>
    );
  };

  const renderContentList = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }

    const filteredMaterials = materials.filter(m => m.type === activeContentType);

    if (filteredMaterials.length === 0) {
      return (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
          <Typography>No {activeContentType} found for Year {activeYear} and Branch {activeBranch}.</Typography>
        </Paper>
      );
    }

    return (
      <Grid container spacing={2}>
        {filteredMaterials.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" noWrap title={item.title}>
                  {item.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {item.subject}
                </Typography>
                <Chip label={`Year: ${item.year}`} size="small" sx={{ mr: 0.5 }} />
                <Chip label={`Sec: ${item.section}`} size="small" />
                {item.message && <Typography variant="body2" sx={{ mt: 1 }}>{item.message}</Typography>}
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                {item.url && (
                  <Button size="small" href={item.url} target="_blank" startIcon={<LinkIcon />}>
                    View
                  </Button>
                )}
                <IconButton onClick={() => handleDelete(item.id)} color="error" size="small" title="Delete item">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Management System
        </Typography>
        <Typography color="text.secondary">
          Add and manage educational content across different years, branches, and content types.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>1. Select Year & Branch</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Year</InputLabel>
              <Select value={activeYear} label="Year" onChange={(e) => setActiveYear(e.target.value)}>
                {years.map(year => <MenuItem key={year} value={year}>Year {year}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Branch</InputLabel>
              <Select value={activeBranch} label="Branch" onChange={(e) => setActiveBranch(e.target.value)}>
                {branches.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>2. Select Content Type</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {contentTypes.map(type => (
                <Button
                  key={type.id}
                  variant={activeContentType === type.id ? 'contained' : 'outlined'}
                  onClick={() => handleContentTypeChange(type.id)}
                  startIcon={type.icon}
                >
                  {type.label}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              3. Add New {contentTypes.find(c => c.id === activeContentType)?.label}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {renderForm()}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              4. Existing Content for Year {activeYear} - {activeBranch}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {renderContentList()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentManager;
