import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal,
  Switch,
  SafeAreaView,
  Image
} from 'react-native';
import { MenuItem } from '../types/menu';
import { 
  fetchMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  fetchCategories 
} from '../services/supabase';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface MenuManagementProps {
  onBack: () => void;
}

export function MenuManagement({ onBack }: MenuManagementProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    addons: {},
    is_available: true,
  });
  const [addonsList, setAddonsList] = useState<Array<{name: string, price: number}>>([]);

  const loadMenuItems = useCallback(async () => {
    try {
      console.log('🔄 Loading menu items...');
      const { data, error } = await fetchMenuItems();
      if (error) {
        console.error('❌ Error loading menu items:', error);
        Alert.alert('Error', `Failed to load menu items: ${error.message || 'Unknown error'}`);
      } else {
        console.log('✅ Menu items loaded:', data?.length || 0, 'items');
        setMenuItems(data || []);
      }
    } catch (error) {
      console.error('❌ Error in loadMenuItems:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      console.log('🔄 Loading categories...');
      const { data, error } = await fetchCategories();
      if (error) {
        console.error('❌ Error loading categories:', error);
      } else {
        console.log('✅ Categories loaded:', data?.length || 0, 'categories');
        // Add some default categories if none exist
        const defaultCategories = ['Main', 'Starter', 'Side', 'Dessert', 'Beverage'];
        const allCategories = [...new Set([...defaultCategories, ...(data || [])])];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('❌ Error in loadCategories:', error);
    }
  }, []);

  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, [loadMenuItems, loadCategories]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: '',
      addons: {},
      is_available: true,
    });
    setAddonsList([]);
    setEditingItem(null);
    setShowCategoryDropdown(false);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    
    // Parse addons - handle both old format (array) and new format (object with name/price)
    let parsedAddons: Array<{name: string, price: number}> = [];
    if (item.addons) {
      if (Array.isArray(item.addons)) {
        // Convert old array format to new object format
        parsedAddons = item.addons.map((addon: any) => 
          typeof addon === 'string' ? { name: addon, price: 0 } : addon
        );
      } else if (typeof item.addons === 'object') {
        // Handle object format
        parsedAddons = Object.entries(item.addons).map(([name, price]) => ({
          name,
          price: typeof price === 'number' ? price : 0
        }));
      }
    }
    
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image_url: item.image_url || '',
      category: item.category,
      addons: item.addons || {},
      is_available: item.is_available,
    });
    setAddonsList(parsedAddons);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Item name is required');
      return;
    }

    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      Alert.alert('Error', 'Valid price is required');
      return;
    }

    // Convert addons list to object format for database storage
    const addonsObject = addonsList.length > 0 
      ? addonsList.reduce((acc, addon) => {
          acc[addon.name] = addon.price;
          return acc;
        }, {} as Record<string, number>)
      : {};

    const itemData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      image_url: formData.image_url.trim(),
      category: formData.category.trim() || 'General',
      addons: addonsObject,
      is_available: formData.is_available,
    };

    try {
      console.log('💾 Saving menu item:', itemData);
      let result;
      if (editingItem) {
        console.log('📝 Updating existing item with ID:', editingItem.id);
        result = await updateMenuItem(editingItem.id, itemData);
      } else {
        console.log('➕ Creating new menu item');
        result = await createMenuItem(itemData);
      }

      if (result.error) {
        console.error('❌ Save failed:', result.error);
        Alert.alert('Error', `Failed to save menu item: ${result.error.message || 'Unknown error'}`);
      } else {
        console.log('✅ Item saved successfully:', result.data);
        setShowModal(false);
        setShowCategoryDropdown(false);
        loadMenuItems();
        loadCategories(); // Reload categories to include any new ones
        resetForm();
      }
    } catch (error) {
      console.error('❌ Error saving item:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleDelete = (item: MenuItem) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            console.log('🗑️ Deleting menu item:', item.id, item.name);
            const { error } = await deleteMenuItem(item.id);
            if (error) {
              console.error('❌ Delete failed:', error);
              Alert.alert('Error', `Failed to delete item: ${error.message || 'Unknown error'}`);
            } else {
              console.log('✅ Item deleted successfully');
              loadMenuItems();
            }
          },
        },
      ]
    );
  };

  const toggleAvailability = async (item: MenuItem) => {
    console.log('🔄 Toggling availability for:', item.name, 'from', item.is_available, 'to', !item.is_available);
    const { error } = await updateMenuItem(item.id, { 
      is_available: !item.is_available 
    });
    if (error) {
      console.error('❌ Availability toggle failed:', error);
      Alert.alert('Error', `Failed to update availability: ${error.message || 'Unknown error'}`);
    } else {
      console.log('✅ Availability updated successfully');
      loadMenuItems();
    }
  };

  // Addon management functions
  const addAddon = () => {
    const newAddon = { name: '', price: 0 };
    setAddonsList(prev => [...prev, newAddon]);
  };

  const updateAddon = (index: number, field: 'name' | 'price', value: string | number) => {
    setAddonsList(prev => prev.map((addon, i) => 
      i === index ? { ...addon, [field]: value } : addon
    ));
  };

  const removeAddon = (index: number) => {
    setAddonsList(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Menu Items</Text>
            <Text style={styles.itemCount}>Loading...</Text>
          </View>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Item</Text>
          </View>
        </View>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.loadingText}>Loading menu items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Menu Items</Text>
          <Text style={styles.itemCount}>{menuItems.length} items</Text>
        </View>
        <TouchableOpacity onPress={openCreateModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items Grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <View key={item.id} style={styles.foodCard}>
              {/* Food Image */}
              <View style={styles.imageContainer}>
                {item.image_url ? (
                  <Image 
                    source={{ uri: item.image_url }} 
                    style={styles.foodImage}
                    onError={() => console.log('Failed to load image:', item.image_url)}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}
                
                {/* Availability Badge */}
                <View style={[
                  styles.availabilityBadge, 
                  { backgroundColor: item.is_available ? COLORS.complete : COLORS.error }
                ]}>
                  <Text style={styles.availabilityText}>
                    {item.is_available ? 'Available' : 'Out of Stock'}
                  </Text>
                </View>
              </View>

              {/* Food Details */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.foodName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.foodPrice}>${item.price.toFixed(2)}</Text>
                </View>
                
                <Text style={styles.foodCategory}>{item.category}</Text>
                
                {item.description ? (
                  <Text style={styles.foodDescription} numberOfLines={3}>
                    {item.description}
                  </Text>
                ) : null}

                {/* Action Buttons */}
                <View style={styles.cardActions}>
                  <View style={styles.availabilityToggle}>
                    <Text style={styles.toggleLabel}>Available</Text>
                    <Switch
                      value={item.is_available}
                      onValueChange={() => toggleAvailability(item)}
                      trackColor={{ false: COLORS.border, true: COLORS.complete }}
                      thumbColor={COLORS.surface}
                      style={styles.switch}
                    />
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      onPress={() => openEditModal(item)}
                      style={styles.editButton}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDelete(item)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => {
                setShowModal(false);
                setShowCategoryDropdown(false);
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter item name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Enter item description"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text style={[styles.dropdownText, !formData.category && styles.placeholderDropdownText]}>
                  {formData.category || 'Select category'}
                </Text>
                <Text style={styles.dropdownArrow}>
                  {showCategoryDropdown ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              
              {showCategoryDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {categories.map((category, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownItem,
                          formData.category === category && styles.selectedDropdownItem
                        ]}
                        onPress={() => {
                          setFormData(prev => ({ ...prev, category }));
                          setShowCategoryDropdown(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          formData.category === category && styles.selectedDropdownItemText
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    
                    {/* Custom category option */}
                    <View style={styles.customCategorySection}>
                      <Text style={styles.customCategoryLabel}>Or enter custom:</Text>
                      <TextInput
                        style={styles.customCategoryInput}
                        placeholder="Enter new category"
                        onChangeText={(text) => {
                          setFormData(prev => ({ ...prev, category: text }));
                        }}
                        onSubmitEditing={() => setShowCategoryDropdown(false)}
                      />
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Image URL</Text>
              <TextInput
                style={styles.input}
                value={formData.image_url}
                onChangeText={(text) => setFormData(prev => ({ ...prev, image_url: text }))}
                placeholder="Enter image URL"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.inputLabel}>Available</Text>
              <Switch
                value={formData.is_available}
                onValueChange={(value) => setFormData(prev => ({ ...prev, is_available: value }))}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.surface}
              />
            </View>

            {/* Addons Management Section */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Addons</Text>
              
              {addonsList.map((addon, index) => (
                <View key={index} style={styles.addonRow}>
                  <View style={styles.addonInputs}>
                    <TextInput
                      style={[styles.input, styles.addonNameInput]}
                      placeholder="Addon name"
                      value={addon.name}
                      onChangeText={(value) => updateAddon(index, 'name', value)}
                    />
                    <TextInput
                      style={[styles.input, styles.addonPriceInput]}
                      placeholder="Price"
                      value={addon.price.toString()}
                      onChangeText={(value) => updateAddon(index, 'price', parseFloat(value) || 0)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.removeAddonButton}
                    onPress={() => removeAddon(index)}
                  >
                    <Text style={styles.removeAddonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addAddonButton}
                onPress={addAddon}
              >
                <Text style={styles.addAddonText}>+ Add Addon</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  backButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  
  backButtonText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
  },
  
  titleContainer: {
    alignItems: 'center',
  },
  
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.onSurface,
  },
  
  itemCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  
  addButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onPrimary,
  },
  
  scrollView: {
    flex: 1,
    padding: SPACING.lg,
  },
  
  // Food Card Styles (Grid Layout)
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  
  foodCard: {
    width: '48%', // 2 columns on tablets
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
    marginBottom: SPACING.md,
  },
  
  imageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: COLORS.surfaceVariant,
  },
  
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
  },
  
  placeholderText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
  },
  
  availabilityBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  availabilityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  
  cardContent: {
    padding: SPACING.md,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  
  foodName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onSurface,
    flex: 1,
    marginRight: SPACING.sm,
  },
  
  foodPrice: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    fontWeight: '700',
  },
  
  foodCategory: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  
  foodDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    gap: SPACING.sm,
  },
  
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  
  toggleLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurface,
    fontWeight: '600',
  },
  
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  
  editButton: {
    backgroundColor: COLORS.processing,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  editButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
  
  deleteButton: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  deleteButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
  
  itemDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    marginTop: SPACING.md,
  },
  
  loadingText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  cancelButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  
  cancelButtonText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.error,
  },
  
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onSurface,
  },
  
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  
  saveButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onPrimary,
  },
  
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  
  inputLabel: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurface,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurface,
    backgroundColor: COLORS.surface,
  },
  
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  
  // Addon management styles
  addonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  addonInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  
  addonNameInput: {
    flex: 2,
  },
  
  addonPriceInput: {
    flex: 1,
  },
  
  removeAddonButton: {
    backgroundColor: COLORS.error,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  
  removeAddonText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  addAddonButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  
  addAddonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface,
  },
  
  // Category dropdown styles
  dropdownButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  dropdownText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurface,
    flex: 1,
  },
  
  placeholderDropdownText: {
    color: COLORS.onSurfaceVariant,
  },
  
  dropdownArrow: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
    marginLeft: SPACING.sm,
  },
  
  dropdownList: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.xs,
    maxHeight: 200,
    ...SHADOWS.sm,
  },
  
  dropdownScroll: {
    maxHeight: 200,
  },
  
  dropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  selectedDropdownItem: {
    backgroundColor: COLORS.primary,
  },
  
  dropdownItemText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurface,
  },
  
  selectedDropdownItemText: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  
  customCategorySection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.md,
  },
  
  customCategoryLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.sm,
  },
  
  customCategoryInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurface,
    backgroundColor: COLORS.surfaceVariant,
  },
});
