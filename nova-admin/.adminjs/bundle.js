(function (React, adminjs, designSystem) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  new adminjs.ApiClient();

  // ─── Styling constants ──────────────────────────────────────────────────────
  const GOLD = '#c5a880';
  const DARK = '#0b0e17';
  const DARK_CARD = '#111627';
  const DARK_SURFACE = '#181c2b';
  const WHITE = '#f5f5f5';
  const WHITE_60 = 'rgba(255,255,255,0.6)';
  const WHITE_40 = 'rgba(255,255,255,0.4)';
  const GRADIENT_GOLD = 'linear-gradient(135deg, #c5a880 0%, #e8d5b7 50%, #c5a880 100%)';
  const CATEGORY_ICONS = {
    rings: '💍',
    earrings: '✨',
    bracelets: '📿',
    pendants: '🔱',
    chains: '🔗',
    bangles: '⭕',
    sets: '🎁',
    astro: '♈'
  };
  const CATEGORY_LABELS = {
    rings: 'Rings',
    earrings: 'Earrings',
    bracelets: 'Bracelets',
    pendants: 'Pendants',
    chains: 'Chains',
    bangles: 'Bangles',
    sets: 'Sets',
    astro: 'Personalised'
  };

  // ─── Main Dashboard Component ───────────────────────────────────────────────
  const Dashboard = () => {
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      const fetchStats = async () => {
        try {
          const response = await fetch('/admin/api/dashboard-stats');
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (err) {
          console.error('Failed to fetch dashboard stats:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }, []);
    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
    if (loading) {
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        style: {
          background: DARK,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        style: {
          textAlign: 'center'
        }
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        style: {
          color: GOLD,
          fontSize: 48,
          marginBottom: 16
        }
      }, "\uD83D\uDC8E"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        style: {
          color: WHITE_60,
          fontSize: 14,
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }
      }, "Loading Dashboard...")));
    }
    const totalProducts = stats?.totalProducts || 0;
    const inStock = stats?.inStock || 0;
    const outOfStock = stats?.outOfStock || 0;
    const withOffers = stats?.withOffers || 0;
    const categoryBreakdown = stats?.categoryBreakdown || {};
    const recentProducts = stats?.recentProducts || [];
    const totalOrders = stats?.totalOrders || 0;
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        background: DARK,
        minHeight: '100vh',
        padding: 0
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        background: 'linear-gradient(135deg, #0b0e17 0%, #1a1f33 50%, #0b0e17 100%)',
        padding: '48px 40px 40px',
        borderBottom: `1px solid rgba(197,168,128,0.15)`,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        backgroundImage: 'radial-gradient(#c5a880 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: GOLD,
        fontSize: 10,
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        fontWeight: 600,
        marginBottom: 8
      }
    }, "NOVA JEWELLERY \u2014 COMMAND CENTER"), /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
      style: {
        color: WHITE,
        fontSize: 32,
        fontWeight: 300,
        letterSpacing: '0.02em',
        marginBottom: 8,
        fontFamily: '"Playfair Display", Georgia, serif'
      }
    }, greeting, ", Admin \uD83D\uDC4B"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: WHITE_60,
        fontSize: 14,
        fontWeight: 300
      }
    }, "Here's what's happening with your jewellery catalogue today \u2014", ' ', now.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 40px 60px'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20,
        marginBottom: 32
      }
    }, /*#__PURE__*/React__default.default.createElement(StatCard, {
      icon: "\uD83D\uDCE6",
      label: "Total Products",
      value: totalProducts,
      accent: GOLD
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      icon: "\u2705",
      label: "In Stock",
      value: inStock,
      accent: "#4ade80"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      icon: "\uD83D\uDEAB",
      label: "Out of Stock",
      value: outOfStock,
      accent: "#f87171"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      icon: "\uD83C\uDFF7\uFE0F",
      label: "Active Offers",
      value: withOffers,
      accent: "#818cf8"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      icon: "\uD83D\uDED2",
      label: "Total Orders",
      value: totalOrders,
      accent: "#38bdf8"
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        marginBottom: 32
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        background: DARK_CARD,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 28
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        fontSize: 20
      }
    }, "\uD83D\uDCCA"), /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      style: {
        color: WHITE,
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: '0.04em',
        margin: 0
      }
    }, "Products by Category")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, Object.entries(categoryBreakdown).map(([cat, count]) => /*#__PURE__*/React__default.default.createElement(CategoryBar, {
      key: cat,
      category: cat,
      count: count,
      total: totalProducts
    })), Object.keys(categoryBreakdown).length === 0 && /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: WHITE_40,
        fontSize: 13,
        fontStyle: 'italic'
      }
    }, "No products yet. Add your first product to see category stats."))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        background: DARK_CARD,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 28,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        fontSize: 20
      }
    }, "\u26A1"), /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      style: {
        color: WHITE,
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: '0.04em',
        margin: 0
      }
    }, "Quick Actions")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flex: 1
      }
    }, /*#__PURE__*/React__default.default.createElement(ActionButton, {
      href: "/admin/resources/Product/actions/new",
      icon: "\u2795",
      label: "Add New Product",
      description: "Create a new jewellery listing with images"
    }), /*#__PURE__*/React__default.default.createElement(ActionButton, {
      href: "/admin/resources/Product",
      icon: "\uD83D\uDCCB",
      label: "View All Products",
      description: "Browse and manage your full catalogue"
    }), /*#__PURE__*/React__default.default.createElement(ActionButton, {
      href: "/admin/resources/Product?filters.stockStatus=OUT_OF_STOCK",
      icon: "\u26A0\uFE0F",
      label: "Out of Stock Items",
      description: "Review products that need restocking"
    }), /*#__PURE__*/React__default.default.createElement(ActionButton, {
      href: "/admin/resources/Product?filters.hasActiveOffer=true",
      icon: "\uD83C\uDFF7\uFE0F",
      label: "Active Offers",
      description: "Manage running discounts and coupons"
    })))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        background: DARK_CARD,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 28
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        fontSize: 20
      }
    }, "\uD83D\uDD50"), /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      style: {
        color: WHITE,
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: '0.04em',
        margin: 0
      }
    }, "Recently Added Products")), /*#__PURE__*/React__default.default.createElement("a", {
      href: "/admin/resources/Product",
      style: {
        color: GOLD,
        fontSize: 12,
        textDecoration: 'none',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontWeight: 600
      }
    }, "View All \u2192")), recentProducts.length > 0 ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16
      }
    }, recentProducts.map(product => /*#__PURE__*/React__default.default.createElement(ProductCard, {
      key: product._id,
      product: product
    }))) : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        textAlign: 'center',
        padding: '40px 20px',
        borderRadius: 12,
        border: '1px dashed rgba(255,255,255,0.1)'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        fontSize: 40,
        marginBottom: 12
      }
    }, "\u2728"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: WHITE_60,
        fontSize: 14
      }
    }, "No products yet. Click \"Add New Product\" to get started!"))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        textAlign: 'center',
        marginTop: 40,
        paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: WHITE_40,
        fontSize: 11,
        letterSpacing: '0.15em',
        textTransform: 'uppercase'
      }
    }, "NOVA Jewellery Admin \u2022 925 Sterling Silver Collection"))));
  };

  // ─── Sub-Components ─────────────────────────────────────────────────────────

  const StatCard = ({
    icon,
    label,
    value,
    accent
  }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
    style: {
      background: DARK_CARD,
      borderRadius: 14,
      padding: '24px 22px',
      border: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }
  }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: accent,
      borderRadius: '14px 14px 0 0'
    }
  }), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
    style: {
      color: WHITE_40,
      fontSize: 11,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
    style: {
      color: WHITE,
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 1,
      fontFamily: '"Inter", sans-serif'
    }
  }, value)), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
    style: {
      fontSize: 32,
      opacity: 0.8
    }
  }, icon)));
  const CategoryBar = ({
    category,
    count,
    total
  }) => {
    const percentage = total > 0 ? Math.round(count / total * 100) : 0;
    const icon = CATEGORY_ICONS[category] || '📦';
    const label = CATEGORY_LABELS[category] || category;
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 10,
        background: DARK_SURFACE,
        border: '1px solid rgba(255,255,255,0.04)'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        fontSize: 18,
        width: 28,
        textAlign: 'center'
      }
    }, icon), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: WHITE,
        fontSize: 13,
        fontWeight: 500
      }
    }, label), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: GOLD,
        fontSize: 12,
        fontWeight: 600
      }
    }, count, " ", /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: WHITE_40,
        fontWeight: 400
      }
    }, "(", percentage, "%)"))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        height: 4,
        borderRadius: 4,
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        height: '100%',
        width: `${percentage}%`,
        background: GRADIENT_GOLD,
        borderRadius: 4,
        transition: 'width 0.6s ease'
      }
    }))));
  };
  const ActionButton = ({
    href,
    icon,
    label,
    description
  }) => /*#__PURE__*/React__default.default.createElement("a", {
    href: href,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 18px',
      borderRadius: 12,
      background: DARK_SURFACE,
      border: '1px solid rgba(255,255,255,0.06)',
      textDecoration: 'none',
      transition: 'all 0.25s ease',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'rgba(197,168,128,0.3)';
      e.currentTarget.style.background = '#1e2338';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.background = DARK_SURFACE;
    }
  }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
    style: {
      fontSize: 22
    }
  }, icon), /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
    style: {
      color: WHITE,
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 2
    }
  }, label), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
    style: {
      color: WHITE_40,
      fontSize: 11,
      fontWeight: 300
    }
  }, description)));
  const ProductCard = ({
    product
  }) => {
    product.imageKeys?.[0];
    const categoryIcon = CATEGORY_ICONS[product.category] || '📦';
    const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
    return /*#__PURE__*/React__default.default.createElement("a", {
      href: `/admin/resources/Product/records/${product._id}/show`,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 12,
        background: DARK_SURFACE,
        border: '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
        transition: 'all 0.25s ease'
      },
      onMouseEnter: e => {
        e.currentTarget.style.borderColor = 'rgba(197,168,128,0.25)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        width: 56,
        height: 56,
        borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.06)'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        fontSize: 28
      }
    }, categoryIcon)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: WHITE,
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, product.name), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: GOLD,
        fontSize: 13,
        fontWeight: 700
      }
    }, "\u20B9", product.price?.toLocaleString('en-IN')), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: WHITE_40,
        fontSize: 10,
        background: 'rgba(255,255,255,0.06)',
        padding: '2px 8px',
        borderRadius: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }
    }, categoryLabel), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 6,
        fontWeight: 600,
        background: product.stockStatus === 'IN_STOCK' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
        color: product.stockStatus === 'IN_STOCK' ? '#4ade80' : '#f87171'
      }
    }, product.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out'))), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        color: WHITE_40,
        fontSize: 10,
        flexShrink: 0
      }
    }, product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    }) : '—'));
  };

  const Edit = ({ property, record, onChange }) => {
      const { translateProperty } = adminjs.useTranslation();
      const { params } = record;
      const { custom } = property;
      const path = adminjs.flat.get(params, custom.filePathProperty);
      const key = adminjs.flat.get(params, custom.keyProperty);
      const file = adminjs.flat.get(params, custom.fileProperty);
      const [originalKey, setOriginalKey] = React.useState(key);
      const [filesToUpload, setFilesToUpload] = React.useState([]);
      React.useEffect(() => {
          // it means means that someone hit save and new file has been uploaded
          // in this case fliesToUpload should be cleared.
          // This happens when user turns off redirect after new/edit
          if ((typeof key === 'string' && key !== originalKey)
              || (typeof key !== 'string' && !originalKey)
              || (typeof key !== 'string' && Array.isArray(key) && key.length !== originalKey.length)) {
              setOriginalKey(key);
              setFilesToUpload([]);
          }
      }, [key, originalKey]);
      const onUpload = (files) => {
          setFilesToUpload(files);
          onChange(custom.fileProperty, files);
      };
      const handleRemove = () => {
          onChange(custom.fileProperty, null);
      };
      const handleMultiRemove = (singleKey) => {
          const index = (adminjs.flat.get(record.params, custom.keyProperty) || []).indexOf(singleKey);
          const filesToDelete = adminjs.flat.get(record.params, custom.filesToDeleteProperty) || [];
          if (path && path.length > 0) {
              const newPath = path.map((currentPath, i) => (i !== index ? currentPath : null));
              let newParams = adminjs.flat.set(record.params, custom.filesToDeleteProperty, [...filesToDelete, index]);
              newParams = adminjs.flat.set(newParams, custom.filePathProperty, newPath);
              onChange({
                  ...record,
                  params: newParams,
              });
          }
          else {
              // eslint-disable-next-line no-console
              console.log('You cannot remove file when there are no uploaded files yet');
          }
      };
      return (React__default.default.createElement(designSystem.FormGroup, null,
          React__default.default.createElement(designSystem.Label, null, translateProperty(property.label, property.resourceId)),
          React__default.default.createElement(designSystem.DropZone, { onChange: onUpload, multiple: custom.multiple, validate: {
                  mimeTypes: custom.mimeTypes,
                  maxSize: custom.maxSize,
              }, files: filesToUpload }),
          !custom.multiple && key && path && !filesToUpload.length && file !== null && (React__default.default.createElement(designSystem.DropZoneItem, { filename: key, src: path, onRemove: handleRemove })),
          custom.multiple && key && key.length && path ? (React__default.default.createElement(React__default.default.Fragment, null, key.map((singleKey, index) => {
              // when we remove items we set only path index to nulls.
              // key is still there. This is because
              // we have to maintain all the indexes. So here we simply filter out elements which
              // were removed and display only what was left
              const currentPath = path[index];
              return currentPath ? (React__default.default.createElement(designSystem.DropZoneItem, { key: singleKey, filename: singleKey, src: path[index], onRemove: () => handleMultiRemove(singleKey) })) : '';
          }))) : ''));
  };

  const AudioMimeTypes = [
      'audio/aac',
      'audio/midi',
      'audio/x-midi',
      'audio/mpeg',
      'audio/ogg',
      'application/ogg',
      'audio/opus',
      'audio/wav',
      'audio/webm',
      'audio/3gpp2',
  ];
  const ImageMimeTypes = [
      'image/bmp',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/vnd.microsoft.icon',
      'image/tiff',
      'image/webp',
  ];

  // eslint-disable-next-line import/no-extraneous-dependencies
  const SingleFile = (props) => {
      const { name, path, mimeType, width } = props;
      if (path && path.length) {
          if (mimeType && ImageMimeTypes.includes(mimeType)) {
              return (React__default.default.createElement("img", { src: path, style: { maxHeight: width, maxWidth: width }, alt: name }));
          }
          if (mimeType && AudioMimeTypes.includes(mimeType)) {
              return (React__default.default.createElement("audio", { controls: true, src: path },
                  "Your browser does not support the",
                  React__default.default.createElement("code", null, "audio"),
                  React__default.default.createElement("track", { kind: "captions" })));
          }
      }
      return (React__default.default.createElement(designSystem.Box, null,
          React__default.default.createElement(designSystem.Button, { as: "a", href: path, ml: "default", size: "sm", rounded: true, target: "_blank" },
              React__default.default.createElement(designSystem.Icon, { icon: "DocumentDownload", color: "white", mr: "default" }),
              name)));
  };
  const File = ({ width, record, property }) => {
      const { custom } = property;
      let path = adminjs.flat.get(record?.params, custom.filePathProperty);
      if (!path) {
          return null;
      }
      const name = adminjs.flat.get(record?.params, custom.fileNameProperty ? custom.fileNameProperty : custom.keyProperty);
      const mimeType = custom.mimeTypeProperty
          && adminjs.flat.get(record?.params, custom.mimeTypeProperty);
      if (!property.custom.multiple) {
          if (custom.opts && custom.opts.baseUrl) {
              path = `${custom.opts.baseUrl}/${name}`;
          }
          return (React__default.default.createElement(SingleFile, { path: path, name: name, width: width, mimeType: mimeType }));
      }
      if (custom.opts && custom.opts.baseUrl) {
          const baseUrl = custom.opts.baseUrl || '';
          path = path.map((singlePath, index) => `${baseUrl}/${name[index]}`);
      }
      return (React__default.default.createElement(React__default.default.Fragment, null, path.map((singlePath, index) => (React__default.default.createElement(SingleFile, { key: singlePath, path: singlePath, name: name[index], width: width, mimeType: mimeType[index] })))));
  };

  const List = (props) => (React__default.default.createElement(File, { width: 100, ...props }));

  const Show = (props) => {
      const { property } = props;
      const { translateProperty } = adminjs.useTranslation();
      return (React__default.default.createElement(designSystem.FormGroup, null,
          React__default.default.createElement(designSystem.Label, null, translateProperty(property.label, property.resourceId)),
          React__default.default.createElement(File, { width: "100%", ...props })));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.UploadEditComponent = Edit;
  AdminJS.UserComponents.UploadListComponent = List;
  AdminJS.UserComponents.UploadShowComponent = Show;

})(React, AdminJS, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9jb21wb25lbnRzL0Rhc2hib2FyZC5qc3giLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkRWRpdENvbXBvbmVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvdHlwZXMvbWltZS10eXBlcy50eXBlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL2ZpbGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkTGlzdENvbXBvbmVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRTaG93Q29tcG9uZW50LmpzIiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBBcGlDbGllbnQgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCB7XG4gIEJveCxcbiAgSDIsXG4gIEg0LFxuICBUZXh0LFxuICBCdXR0b24sXG4gIEljb24sXG59IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KCk7XG5cbi8vIOKUgOKUgOKUgCBTdHlsaW5nIGNvbnN0YW50cyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IEdPTEQgPSAnI2M1YTg4MCc7XG5jb25zdCBEQVJLID0gJyMwYjBlMTcnO1xuY29uc3QgREFSS19DQVJEID0gJyMxMTE2MjcnO1xuY29uc3QgREFSS19TVVJGQUNFID0gJyMxODFjMmInO1xuY29uc3QgV0hJVEUgPSAnI2Y1ZjVmNSc7XG5jb25zdCBXSElURV82MCA9ICdyZ2JhKDI1NSwyNTUsMjU1LDAuNiknO1xuY29uc3QgV0hJVEVfNDAgPSAncmdiYSgyNTUsMjU1LDI1NSwwLjQpJztcbmNvbnN0IEdSQURJRU5UX0dPTEQgPSAnbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2M1YTg4MCAwJSwgI2U4ZDViNyA1MCUsICNjNWE4ODAgMTAwJSknO1xuY29uc3QgR1JBRElFTlRfREFSSyA9ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMGIwZTE3IDAlLCAjMTgxYzJiIDEwMCUpJztcblxuY29uc3QgQ0FURUdPUllfSUNPTlMgPSB7XG4gIHJpbmdzOiAn8J+SjScsXG4gIGVhcnJpbmdzOiAn4pyoJyxcbiAgYnJhY2VsZXRzOiAn8J+TvycsXG4gIHBlbmRhbnRzOiAn8J+UsScsXG4gIGNoYWluczogJ/CflJcnLFxuICBiYW5nbGVzOiAn4q2VJyxcbiAgc2V0czogJ/CfjoEnLFxuICBhc3RybzogJ+KZiCcsXG59O1xuXG5jb25zdCBDQVRFR09SWV9MQUJFTFMgPSB7XG4gIHJpbmdzOiAnUmluZ3MnLFxuICBlYXJyaW5nczogJ0VhcnJpbmdzJyxcbiAgYnJhY2VsZXRzOiAnQnJhY2VsZXRzJyxcbiAgcGVuZGFudHM6ICdQZW5kYW50cycsXG4gIGNoYWluczogJ0NoYWlucycsXG4gIGJhbmdsZXM6ICdCYW5nbGVzJyxcbiAgc2V0czogJ1NldHMnLFxuICBhc3RybzogJ1BlcnNvbmFsaXNlZCcsXG59O1xuXG4vLyDilIDilIDilIAgTWFpbiBEYXNoYm9hcmQgQ29tcG9uZW50IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBbc3RhdHMsIHNldFN0YXRzXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGZldGNoU3RhdHMgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYWRtaW4vYXBpL2Rhc2hib2FyZC1zdGF0cycpO1xuICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgIHNldFN0YXRzKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGZldGNoIGRhc2hib2FyZCBzdGF0czonLCBlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBmZXRjaFN0YXRzKCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBncmVldGluZyA9XG4gICAgbm93LmdldEhvdXJzKCkgPCAxMiA/ICdHb29kIE1vcm5pbmcnIDogbm93LmdldEhvdXJzKCkgPCAxNyA/ICdHb29kIEFmdGVybm9vbicgOiAnR29vZCBFdmVuaW5nJztcblxuICBpZiAobG9hZGluZykge1xuICAgIHJldHVybiAoXG4gICAgICA8Qm94XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgYmFja2dyb3VuZDogREFSSyxcbiAgICAgICAgICBtaW5IZWlnaHQ6ICcxMDB2aCcsXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEJveCBzdHlsZT17eyB0ZXh0QWxpZ246ICdjZW50ZXInIH19PlxuICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGNvbG9yOiBHT0xELCBmb250U2l6ZTogNDgsIG1hcmdpbkJvdHRvbTogMTYgfX0+8J+SjjwvVGV4dD5cbiAgICAgICAgICA8VGV4dCBzdHlsZT17eyBjb2xvcjogV0hJVEVfNjAsIGZvbnRTaXplOiAxNCwgbGV0dGVyU3BhY2luZzogJzAuMmVtJywgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScgfX0+XG4gICAgICAgICAgICBMb2FkaW5nIERhc2hib2FyZC4uLlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgdG90YWxQcm9kdWN0cyA9IHN0YXRzPy50b3RhbFByb2R1Y3RzIHx8IDA7XG4gIGNvbnN0IGluU3RvY2sgPSBzdGF0cz8uaW5TdG9jayB8fCAwO1xuICBjb25zdCBvdXRPZlN0b2NrID0gc3RhdHM/Lm91dE9mU3RvY2sgfHwgMDtcbiAgY29uc3Qgd2l0aE9mZmVycyA9IHN0YXRzPy53aXRoT2ZmZXJzIHx8IDA7XG4gIGNvbnN0IGNhdGVnb3J5QnJlYWtkb3duID0gc3RhdHM/LmNhdGVnb3J5QnJlYWtkb3duIHx8IHt9O1xuICBjb25zdCByZWNlbnRQcm9kdWN0cyA9IHN0YXRzPy5yZWNlbnRQcm9kdWN0cyB8fCBbXTtcbiAgY29uc3QgdG90YWxPcmRlcnMgPSBzdGF0cz8udG90YWxPcmRlcnMgfHwgMDtcblxuICByZXR1cm4gKFxuICAgIDxCb3ggc3R5bGU9e3sgYmFja2dyb3VuZDogREFSSywgbWluSGVpZ2h0OiAnMTAwdmgnLCBwYWRkaW5nOiAwIH19PlxuICAgICAgey8qIOKUgOKUgOKUgCBIZXJvIEJhbm5lciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgKi99XG4gICAgICA8Qm94XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgxMzVkZWcsICMwYjBlMTcgMCUsICMxYTFmMzMgNTAlLCAjMGIwZTE3IDEwMCUpJyxcbiAgICAgICAgICBwYWRkaW5nOiAnNDhweCA0MHB4IDQwcHgnLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCByZ2JhKDE5NywxNjgsMTI4LDAuMTUpYCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHsvKiBEZWNvcmF0aXZlIGRvdHMgcGF0dGVybiAqL31cbiAgICAgICAgPEJveFxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGluc2V0OiAwLFxuICAgICAgICAgICAgb3BhY2l0eTogMC4wNSxcbiAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogJ3JhZGlhbC1ncmFkaWVudCgjYzVhODgwIDFweCwgdHJhbnNwYXJlbnQgMXB4KScsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogJzIwcHggMjBweCcsXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPEJveCBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgekluZGV4OiAxLCBtYXhXaWR0aDogMTIwMCwgbWFyZ2luOiAnMCBhdXRvJyB9fT5cbiAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3I6IEdPTEQsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMzVlbScsXG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250V2VpZ2h0OiA2MDAsXG4gICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogOCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgTk9WQSBKRVdFTExFUlkg4oCUIENPTU1BTkQgQ0VOVEVSXG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxIMlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3I6IFdISVRFLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMzIsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDMwMCxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMDJlbScsXG4gICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogOCxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1wiUGxheWZhaXIgRGlzcGxheVwiLCBHZW9yZ2lhLCBzZXJpZicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtncmVldGluZ30sIEFkbWluIPCfkYtcbiAgICAgICAgICA8L0gyPlxuICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGNvbG9yOiBXSElURV82MCwgZm9udFNpemU6IDE0LCBmb250V2VpZ2h0OiAzMDAgfX0+XG4gICAgICAgICAgICBIZXJlJ3Mgd2hhdCdzIGhhcHBlbmluZyB3aXRoIHlvdXIgamV3ZWxsZXJ5IGNhdGFsb2d1ZSB0b2RheSDigJR7JyAnfVxuICAgICAgICAgICAge25vdy50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUlOJywgeyB3ZWVrZGF5OiAnbG9uZycsIHllYXI6ICdudW1lcmljJywgbW9udGg6ICdsb25nJywgZGF5OiAnbnVtZXJpYycgfSl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7Lyog4pSA4pSA4pSAIENvbnRlbnQgQXJlYSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgKi99XG4gICAgICA8Qm94IHN0eWxlPXt7IG1heFdpZHRoOiAxMjAwLCBtYXJnaW46ICcwIGF1dG8nLCBwYWRkaW5nOiAnMzJweCA0MHB4IDYwcHgnIH19PlxuICAgICAgICB7Lyog4pSA4pSA4pSAIEtQSSBDYXJkcyBSb3cg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovfVxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6ICdncmlkJyxcbiAgICAgICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgyMjBweCwgMWZyKSknLFxuICAgICAgICAgICAgZ2FwOiAyMCxcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMzIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgICAgaWNvbj1cIvCfk6ZcIlxuICAgICAgICAgICAgbGFiZWw9XCJUb3RhbCBQcm9kdWN0c1wiXG4gICAgICAgICAgICB2YWx1ZT17dG90YWxQcm9kdWN0c31cbiAgICAgICAgICAgIGFjY2VudD17R09MRH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgICAgaWNvbj1cIuKchVwiXG4gICAgICAgICAgICBsYWJlbD1cIkluIFN0b2NrXCJcbiAgICAgICAgICAgIHZhbHVlPXtpblN0b2NrfVxuICAgICAgICAgICAgYWNjZW50PVwiIzRhZGU4MFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICAgIGljb249XCLwn5qrXCJcbiAgICAgICAgICAgIGxhYmVsPVwiT3V0IG9mIFN0b2NrXCJcbiAgICAgICAgICAgIHZhbHVlPXtvdXRPZlN0b2NrfVxuICAgICAgICAgICAgYWNjZW50PVwiI2Y4NzE3MVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICAgIGljb249XCLwn4+377iPXCJcbiAgICAgICAgICAgIGxhYmVsPVwiQWN0aXZlIE9mZmVyc1wiXG4gICAgICAgICAgICB2YWx1ZT17d2l0aE9mZmVyc31cbiAgICAgICAgICAgIGFjY2VudD1cIiM4MThjZjhcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgICBpY29uPVwi8J+bklwiXG4gICAgICAgICAgICBsYWJlbD1cIlRvdGFsIE9yZGVyc1wiXG4gICAgICAgICAgICB2YWx1ZT17dG90YWxPcmRlcnN9XG4gICAgICAgICAgICBhY2NlbnQ9XCIjMzhiZGY4XCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L0JveD5cblxuICAgICAgICB7Lyog4pSA4pSA4pSAIFR3by1jb2x1bW4gbGF5b3V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL31cbiAgICAgICAgPEJveFxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAnMWZyIDFmcicsXG4gICAgICAgICAgICBnYXA6IDI0LFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAzMixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgey8qIENhdGVnb3J5IEJyZWFrZG93biAqL31cbiAgICAgICAgICA8Qm94XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBEQVJLX0NBUkQsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTYsXG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMDYpJyxcbiAgICAgICAgICAgICAgcGFkZGluZzogMjgsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCb3ggc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxMCwgbWFyZ2luQm90dG9tOiAyNCB9fT5cbiAgICAgICAgICAgICAgPFRleHQgc3R5bGU9e3sgZm9udFNpemU6IDIwIH19PvCfk4o8L1RleHQ+XG4gICAgICAgICAgICAgIDxINFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBjb2xvcjogV0hJVEUsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTYsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA1MDAsXG4gICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wNGVtJyxcbiAgICAgICAgICAgICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgUHJvZHVjdHMgYnkgQ2F0ZWdvcnlcbiAgICAgICAgICAgICAgPC9IND5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPEJveCBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6IDEwIH19PlxuICAgICAgICAgICAgICB7T2JqZWN0LmVudHJpZXMoY2F0ZWdvcnlCcmVha2Rvd24pLm1hcCgoW2NhdCwgY291bnRdKSA9PiAoXG4gICAgICAgICAgICAgICAgPENhdGVnb3J5QmFyXG4gICAgICAgICAgICAgICAgICBrZXk9e2NhdH1cbiAgICAgICAgICAgICAgICAgIGNhdGVnb3J5PXtjYXR9XG4gICAgICAgICAgICAgICAgICBjb3VudD17Y291bnR9XG4gICAgICAgICAgICAgICAgICB0b3RhbD17dG90YWxQcm9kdWN0c31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAge09iamVjdC5rZXlzKGNhdGVnb3J5QnJlYWtkb3duKS5sZW5ndGggPT09IDAgJiYgKFxuICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGNvbG9yOiBXSElURV80MCwgZm9udFNpemU6IDEzLCBmb250U3R5bGU6ICdpdGFsaWMnIH19PlxuICAgICAgICAgICAgICAgICAgTm8gcHJvZHVjdHMgeWV0LiBBZGQgeW91ciBmaXJzdCBwcm9kdWN0IHRvIHNlZSBjYXRlZ29yeSBzdGF0cy5cbiAgICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8L0JveD5cblxuICAgICAgICAgIHsvKiBRdWljayBBY3Rpb25zICovfVxuICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IERBUktfQ0FSRCxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxNixcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4wNiknLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAyOCxcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEJveCBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6IDEwLCBtYXJnaW5Cb3R0b206IDI0IH19PlxuICAgICAgICAgICAgICA8VGV4dCBzdHlsZT17eyBmb250U2l6ZTogMjAgfX0+4pqhPC9UZXh0PlxuICAgICAgICAgICAgICA8SDRcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgY29sb3I6IFdISVRFLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE2LFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMDRlbScsXG4gICAgICAgICAgICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIFF1aWNrIEFjdGlvbnNcbiAgICAgICAgICAgICAgPC9IND5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPEJveCBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6IDEyLCBmbGV4OiAxIH19PlxuICAgICAgICAgICAgICA8QWN0aW9uQnV0dG9uXG4gICAgICAgICAgICAgICAgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvUHJvZHVjdC9hY3Rpb25zL25ld1wiXG4gICAgICAgICAgICAgICAgaWNvbj1cIuKelVwiXG4gICAgICAgICAgICAgICAgbGFiZWw9XCJBZGQgTmV3IFByb2R1Y3RcIlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPVwiQ3JlYXRlIGEgbmV3IGpld2VsbGVyeSBsaXN0aW5nIHdpdGggaW1hZ2VzXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPEFjdGlvbkJ1dHRvblxuICAgICAgICAgICAgICAgIGhyZWY9XCIvYWRtaW4vcmVzb3VyY2VzL1Byb2R1Y3RcIlxuICAgICAgICAgICAgICAgIGljb249XCLwn5OLXCJcbiAgICAgICAgICAgICAgICBsYWJlbD1cIlZpZXcgQWxsIFByb2R1Y3RzXCJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbj1cIkJyb3dzZSBhbmQgbWFuYWdlIHlvdXIgZnVsbCBjYXRhbG9ndWVcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8QWN0aW9uQnV0dG9uXG4gICAgICAgICAgICAgICAgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvUHJvZHVjdD9maWx0ZXJzLnN0b2NrU3RhdHVzPU9VVF9PRl9TVE9DS1wiXG4gICAgICAgICAgICAgICAgaWNvbj1cIuKaoO+4j1wiXG4gICAgICAgICAgICAgICAgbGFiZWw9XCJPdXQgb2YgU3RvY2sgSXRlbXNcIlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPVwiUmV2aWV3IHByb2R1Y3RzIHRoYXQgbmVlZCByZXN0b2NraW5nXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPEFjdGlvbkJ1dHRvblxuICAgICAgICAgICAgICAgIGhyZWY9XCIvYWRtaW4vcmVzb3VyY2VzL1Byb2R1Y3Q/ZmlsdGVycy5oYXNBY3RpdmVPZmZlcj10cnVlXCJcbiAgICAgICAgICAgICAgICBpY29uPVwi8J+Pt++4j1wiXG4gICAgICAgICAgICAgICAgbGFiZWw9XCJBY3RpdmUgT2ZmZXJzXCJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbj1cIk1hbmFnZSBydW5uaW5nIGRpc2NvdW50cyBhbmQgY291cG9uc1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgey8qIOKUgOKUgOKUgCBSZWNlbnQgUHJvZHVjdHMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovfVxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IERBUktfQ0FSRCxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTYsXG4gICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjA2KScsXG4gICAgICAgICAgICBwYWRkaW5nOiAyOCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJveFxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAyNCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEJveCBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6IDEwIH19PlxuICAgICAgICAgICAgICA8VGV4dCBzdHlsZT17eyBmb250U2l6ZTogMjAgfX0+8J+VkDwvVGV4dD5cbiAgICAgICAgICAgICAgPEg0XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBXSElURSxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjA0ZW0nLFxuICAgICAgICAgICAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBSZWNlbnRseSBBZGRlZCBQcm9kdWN0c1xuICAgICAgICAgICAgICA8L0g0PlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICBocmVmPVwiL2FkbWluL3Jlc291cmNlcy9Qcm9kdWN0XCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBjb2xvcjogR09MRCxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246ICdub25lJyxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4xZW0nLFxuICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgVmlldyBBbGwg4oaSXG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICB7cmVjZW50UHJvZHVjdHMubGVuZ3RoID4gMCA/IChcbiAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgyODBweCwgMWZyKSknLFxuICAgICAgICAgICAgICAgIGdhcDogMTYsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtyZWNlbnRQcm9kdWN0cy5tYXAoKHByb2R1Y3QpID0+IChcbiAgICAgICAgICAgICAgICA8UHJvZHVjdENhcmQga2V5PXtwcm9kdWN0Ll9pZH0gcHJvZHVjdD17cHJvZHVjdH0gLz5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzQwcHggMjBweCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxMixcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggZGFzaGVkIHJnYmEoMjU1LDI1NSwyNTUsMC4xKScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGZvbnRTaXplOiA0MCwgbWFyZ2luQm90dG9tOiAxMiB9fT7inKg8L1RleHQ+XG4gICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGNvbG9yOiBXSElURV82MCwgZm9udFNpemU6IDE0IH19PlxuICAgICAgICAgICAgICAgIE5vIHByb2R1Y3RzIHlldC4gQ2xpY2sgXCJBZGQgTmV3IFByb2R1Y3RcIiB0byBnZXQgc3RhcnRlZCFcbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgey8qIOKUgOKUgOKUgCBGb290ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovfVxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBtYXJnaW5Ub3A6IDQwLFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogMjQsXG4gICAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjA1KScsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGNvbG9yOiBXSElURV80MCwgZm9udFNpemU6IDExLCBsZXR0ZXJTcGFjaW5nOiAnMC4xNWVtJywgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScgfX0+XG4gICAgICAgICAgICBOT1ZBIEpld2VsbGVyeSBBZG1pbiDigKIgOTI1IFN0ZXJsaW5nIFNpbHZlciBDb2xsZWN0aW9uXG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApO1xufTtcblxuLy8g4pSA4pSA4pSAIFN1Yi1Db21wb25lbnRzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5jb25zdCBTdGF0Q2FyZCA9ICh7IGljb24sIGxhYmVsLCB2YWx1ZSwgYWNjZW50IH0pID0+IChcbiAgPEJveFxuICAgIHN0eWxlPXt7XG4gICAgICBiYWNrZ3JvdW5kOiBEQVJLX0NBUkQsXG4gICAgICBib3JkZXJSYWRpdXM6IDE0LFxuICAgICAgcGFkZGluZzogJzI0cHggMjJweCcsXG4gICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjA2KScsXG4gICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4zcyBlYXNlJyxcbiAgICB9fVxuICA+XG4gICAgPEJveFxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgYmFja2dyb3VuZDogYWNjZW50LFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxNHB4IDE0cHggMCAwJyxcbiAgICAgIH19XG4gICAgLz5cbiAgICA8Qm94IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XG4gICAgICA8Qm94PlxuICAgICAgICA8VGV4dCBzdHlsZT17eyBjb2xvcjogV0hJVEVfNDAsIGZvbnRTaXplOiAxMSwgbGV0dGVyU3BhY2luZzogJzAuMTJlbScsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBtYXJnaW5Cb3R0b206IDYgfX0+XG4gICAgICAgICAge2xhYmVsfVxuICAgICAgICA8L1RleHQ+XG4gICAgICAgIDxUZXh0IHN0eWxlPXt7IGNvbG9yOiBXSElURSwgZm9udFNpemU6IDMyLCBmb250V2VpZ2h0OiA3MDAsIGxpbmVIZWlnaHQ6IDEsIGZvbnRGYW1pbHk6ICdcIkludGVyXCIsIHNhbnMtc2VyaWYnIH19PlxuICAgICAgICAgIHt2YWx1ZX1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG4gICAgICA8VGV4dCBzdHlsZT17eyBmb250U2l6ZTogMzIsIG9wYWNpdHk6IDAuOCB9fT57aWNvbn08L1RleHQ+XG4gICAgPC9Cb3g+XG4gIDwvQm94PlxuKTtcblxuY29uc3QgQ2F0ZWdvcnlCYXIgPSAoeyBjYXRlZ29yeSwgY291bnQsIHRvdGFsIH0pID0+IHtcbiAgY29uc3QgcGVyY2VudGFnZSA9IHRvdGFsID4gMCA/IE1hdGgucm91bmQoKGNvdW50IC8gdG90YWwpICogMTAwKSA6IDA7XG4gIGNvbnN0IGljb24gPSBDQVRFR09SWV9JQ09OU1tjYXRlZ29yeV0gfHwgJ/Cfk6YnO1xuICBjb25zdCBsYWJlbCA9IENBVEVHT1JZX0xBQkVMU1tjYXRlZ29yeV0gfHwgY2F0ZWdvcnk7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6IDEyLFxuICAgICAgICBwYWRkaW5nOiAnMTBweCAxNHB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAxMCxcbiAgICAgICAgYmFja2dyb3VuZDogREFSS19TVVJGQUNFLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjA0KScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxUZXh0IHN0eWxlPXt7IGZvbnRTaXplOiAxOCwgd2lkdGg6IDI4LCB0ZXh0QWxpZ246ICdjZW50ZXInIH19PntpY29ufTwvVGV4dD5cbiAgICAgIDxCb3ggc3R5bGU9e3sgZmxleDogMSB9fT5cbiAgICAgICAgPEJveCBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIG1hcmdpbkJvdHRvbTogNiB9fT5cbiAgICAgICAgICA8VGV4dCBzdHlsZT17eyBjb2xvcjogV0hJVEUsIGZvbnRTaXplOiAxMywgZm9udFdlaWdodDogNTAwIH19PntsYWJlbH08L1RleHQ+XG4gICAgICAgICAgPFRleHQgc3R5bGU9e3sgY29sb3I6IEdPTEQsIGZvbnRTaXplOiAxMiwgZm9udFdlaWdodDogNjAwIH19PlxuICAgICAgICAgICAge2NvdW50fSA8c3BhbiBzdHlsZT17eyBjb2xvcjogV0hJVEVfNDAsIGZvbnRXZWlnaHQ6IDQwMCB9fT4oe3BlcmNlbnRhZ2V9JSk8L3NwYW4+XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPEJveFxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBoZWlnaHQ6IDQsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDQsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsMjU1LDI1NSwwLjA2KScsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICB3aWR0aDogYCR7cGVyY2VudGFnZX0lYCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogR1JBRElFTlRfR09MRCxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA0LFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnd2lkdGggMC42cyBlYXNlJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmNvbnN0IEFjdGlvbkJ1dHRvbiA9ICh7IGhyZWYsIGljb24sIGxhYmVsLCBkZXNjcmlwdGlvbiB9KSA9PiAoXG4gIDxhXG4gICAgaHJlZj17aHJlZn1cbiAgICBzdHlsZT17e1xuICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICBnYXA6IDE0LFxuICAgICAgcGFkZGluZzogJzE2cHggMThweCcsXG4gICAgICBib3JkZXJSYWRpdXM6IDEyLFxuICAgICAgYmFja2dyb3VuZDogREFSS19TVVJGQUNFLFxuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4wNiknLFxuICAgICAgdGV4dERlY29yYXRpb246ICdub25lJyxcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4yNXMgZWFzZScsXG4gICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICB9fVxuICAgIG9uTW91c2VFbnRlcj17KGUpID0+IHtcbiAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9ICdyZ2JhKDE5NywxNjgsMTI4LDAuMyknO1xuICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAnIzFlMjMzOCc7XG4gICAgfX1cbiAgICBvbk1vdXNlTGVhdmU9eyhlKSA9PiB7XG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwLjA2KSc7XG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IERBUktfU1VSRkFDRTtcbiAgICB9fVxuICA+XG4gICAgPFRleHQgc3R5bGU9e3sgZm9udFNpemU6IDIyIH19PntpY29ufTwvVGV4dD5cbiAgICA8Qm94PlxuICAgICAgPFRleHQgc3R5bGU9e3sgY29sb3I6IFdISVRFLCBmb250U2l6ZTogMTMsIGZvbnRXZWlnaHQ6IDYwMCwgbWFyZ2luQm90dG9tOiAyIH19PntsYWJlbH08L1RleHQ+XG4gICAgICA8VGV4dCBzdHlsZT17eyBjb2xvcjogV0hJVEVfNDAsIGZvbnRTaXplOiAxMSwgZm9udFdlaWdodDogMzAwIH19PntkZXNjcmlwdGlvbn08L1RleHQ+XG4gICAgPC9Cb3g+XG4gIDwvYT5cbik7XG5cbmNvbnN0IFByb2R1Y3RDYXJkID0gKHsgcHJvZHVjdCB9KSA9PiB7XG4gIGNvbnN0IHIyUHVibGljVXJsID0gJyc7IC8vIFdpbGwgdXNlIHJlbGF0aXZlIFVSTHMgZnJvbSBpbWFnZUtleXNcbiAgY29uc3QgZmlyc3RJbWFnZUtleSA9IHByb2R1Y3QuaW1hZ2VLZXlzPy5bMF07XG4gIGNvbnN0IGltYWdlVXJsID0gZmlyc3RJbWFnZUtleSA/IGAvYWRtaW4vYXBpL3Byb2R1Y3QtaW1hZ2U/a2V5PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZpcnN0SW1hZ2VLZXkpfWAgOiBudWxsO1xuICBjb25zdCBjYXRlZ29yeUljb24gPSBDQVRFR09SWV9JQ09OU1twcm9kdWN0LmNhdGVnb3J5XSB8fCAn8J+Tpic7XG4gIGNvbnN0IGNhdGVnb3J5TGFiZWwgPSBDQVRFR09SWV9MQUJFTFNbcHJvZHVjdC5jYXRlZ29yeV0gfHwgcHJvZHVjdC5jYXRlZ29yeTtcblxuICByZXR1cm4gKFxuICAgIDxhXG4gICAgICBocmVmPXtgL2FkbWluL3Jlc291cmNlcy9Qcm9kdWN0L3JlY29yZHMvJHtwcm9kdWN0Ll9pZH0vc2hvd2B9XG4gICAgICBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBnYXA6IDE2LFxuICAgICAgICBwYWRkaW5nOiAxNixcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAxMixcbiAgICAgICAgYmFja2dyb3VuZDogREFSS19TVVJGQUNFLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjA2KScsXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiAnbm9uZScsXG4gICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4yNXMgZWFzZScsXG4gICAgICB9fVxuICAgICAgb25Nb3VzZUVudGVyPXsoZSkgPT4ge1xuICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSAncmdiYSgxOTcsMTY4LDEyOCwwLjI1KSc7XG4gICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgtMXB4KSc7XG4gICAgICB9fVxuICAgICAgb25Nb3VzZUxlYXZlPXsoZSkgPT4ge1xuICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwLjA2KSc7XG4gICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgwKSc7XG4gICAgICB9fVxuICAgID5cbiAgICAgIHsvKiBUaHVtYm5haWwgKi99XG4gICAgICA8Qm94XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IDU2LFxuICAgICAgICAgIGhlaWdodDogNTYsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAxMCxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsMjU1LDI1NSwwLjA0KScsXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgZmxleFNocmluazogMCxcbiAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjA2KScsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxUZXh0IHN0eWxlPXt7IGZvbnRTaXplOiAyOCB9fT57Y2F0ZWdvcnlJY29ufTwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7LyogSW5mbyAqL31cbiAgICAgIDxCb3ggc3R5bGU9e3sgZmxleDogMSwgbWluV2lkdGg6IDAgfX0+XG4gICAgICAgIDxUZXh0XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGNvbG9yOiBXSElURSxcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogNCxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7cHJvZHVjdC5uYW1lfVxuICAgICAgICA8L1RleHQ+XG4gICAgICAgIDxCb3ggc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiA4IH19PlxuICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGNvbG9yOiBHT0xELCBmb250U2l6ZTogMTMsIGZvbnRXZWlnaHQ6IDcwMCB9fT7igrl7cHJvZHVjdC5wcmljZT8udG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9UZXh0PlxuICAgICAgICAgIDxUZXh0XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBjb2xvcjogV0hJVEVfNDAsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDI1NSwyNTUsMC4wNiknLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAnMnB4IDhweCcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNixcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjA1ZW0nLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7Y2F0ZWdvcnlMYWJlbH1cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgPFRleHRcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzJweCA4cHgnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDYsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogcHJvZHVjdC5zdG9ja1N0YXR1cyA9PT0gJ0lOX1NUT0NLJyA/ICdyZ2JhKDc0LDIyMiwxMjgsMC4xMiknIDogJ3JnYmEoMjQ4LDExMywxMTMsMC4xMiknLFxuICAgICAgICAgICAgICBjb2xvcjogcHJvZHVjdC5zdG9ja1N0YXR1cyA9PT0gJ0lOX1NUT0NLJyA/ICcjNGFkZTgwJyA6ICcjZjg3MTcxJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3Byb2R1Y3Quc3RvY2tTdGF0dXMgPT09ICdJTl9TVE9DSycgPyAnSW4gU3RvY2snIDogJ091dCd9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7LyogRGF0ZSAqL31cbiAgICAgIDxUZXh0IHN0eWxlPXt7IGNvbG9yOiBXSElURV80MCwgZm9udFNpemU6IDEwLCBmbGV4U2hyaW5rOiAwIH19PlxuICAgICAgICB7cHJvZHVjdC5jcmVhdGVkQXRcbiAgICAgICAgICA/IG5ldyBEYXRlKHByb2R1Y3QuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUlOJywgeyBkYXk6ICdudW1lcmljJywgbW9udGg6ICdzaG9ydCcgfSlcbiAgICAgICAgICA6ICfigJQnfVxuICAgICAgPC9UZXh0PlxuICAgIDwvYT5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcbiIsImltcG9ydCB7IERyb3Bab25lLCBEcm9wWm9uZUl0ZW0sIEZvcm1Hcm91cCwgTGFiZWwgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IGZsYXQsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmNvbnN0IEVkaXQgPSAoeyBwcm9wZXJ0eSwgcmVjb3JkLCBvbkNoYW5nZSB9KSA9PiB7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVQcm9wZXJ0eSB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICBjb25zdCB7IHBhcmFtcyB9ID0gcmVjb3JkO1xuICAgIGNvbnN0IHsgY3VzdG9tIH0gPSBwcm9wZXJ0eTtcbiAgICBjb25zdCBwYXRoID0gZmxhdC5nZXQocGFyYW1zLCBjdXN0b20uZmlsZVBhdGhQcm9wZXJ0eSk7XG4gICAgY29uc3Qga2V5ID0gZmxhdC5nZXQocGFyYW1zLCBjdXN0b20ua2V5UHJvcGVydHkpO1xuICAgIGNvbnN0IGZpbGUgPSBmbGF0LmdldChwYXJhbXMsIGN1c3RvbS5maWxlUHJvcGVydHkpO1xuICAgIGNvbnN0IFtvcmlnaW5hbEtleSwgc2V0T3JpZ2luYWxLZXldID0gdXNlU3RhdGUoa2V5KTtcbiAgICBjb25zdCBbZmlsZXNUb1VwbG9hZCwgc2V0RmlsZXNUb1VwbG9hZF0gPSB1c2VTdGF0ZShbXSk7XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgLy8gaXQgbWVhbnMgbWVhbnMgdGhhdCBzb21lb25lIGhpdCBzYXZlIGFuZCBuZXcgZmlsZSBoYXMgYmVlbiB1cGxvYWRlZFxuICAgICAgICAvLyBpbiB0aGlzIGNhc2UgZmxpZXNUb1VwbG9hZCBzaG91bGQgYmUgY2xlYXJlZC5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zIHdoZW4gdXNlciB0dXJucyBvZmYgcmVkaXJlY3QgYWZ0ZXIgbmV3L2VkaXRcbiAgICAgICAgaWYgKCh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyAmJiBrZXkgIT09IG9yaWdpbmFsS2V5KVxuICAgICAgICAgICAgfHwgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnICYmICFvcmlnaW5hbEtleSlcbiAgICAgICAgICAgIHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJyAmJiBBcnJheS5pc0FycmF5KGtleSkgJiYga2V5Lmxlbmd0aCAhPT0gb3JpZ2luYWxLZXkubGVuZ3RoKSkge1xuICAgICAgICAgICAgc2V0T3JpZ2luYWxLZXkoa2V5KTtcbiAgICAgICAgICAgIHNldEZpbGVzVG9VcGxvYWQoW10pO1xuICAgICAgICB9XG4gICAgfSwgW2tleSwgb3JpZ2luYWxLZXldKTtcbiAgICBjb25zdCBvblVwbG9hZCA9IChmaWxlcykgPT4ge1xuICAgICAgICBzZXRGaWxlc1RvVXBsb2FkKGZpbGVzKTtcbiAgICAgICAgb25DaGFuZ2UoY3VzdG9tLmZpbGVQcm9wZXJ0eSwgZmlsZXMpO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlUmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICBvbkNoYW5nZShjdXN0b20uZmlsZVByb3BlcnR5LCBudWxsKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZU11bHRpUmVtb3ZlID0gKHNpbmdsZUtleSkgPT4ge1xuICAgICAgICBjb25zdCBpbmRleCA9IChmbGF0LmdldChyZWNvcmQucGFyYW1zLCBjdXN0b20ua2V5UHJvcGVydHkpIHx8IFtdKS5pbmRleE9mKHNpbmdsZUtleSk7XG4gICAgICAgIGNvbnN0IGZpbGVzVG9EZWxldGUgPSBmbGF0LmdldChyZWNvcmQucGFyYW1zLCBjdXN0b20uZmlsZXNUb0RlbGV0ZVByb3BlcnR5KSB8fCBbXTtcbiAgICAgICAgaWYgKHBhdGggJiYgcGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5tYXAoKGN1cnJlbnRQYXRoLCBpKSA9PiAoaSAhPT0gaW5kZXggPyBjdXJyZW50UGF0aCA6IG51bGwpKTtcbiAgICAgICAgICAgIGxldCBuZXdQYXJhbXMgPSBmbGF0LnNldChyZWNvcmQucGFyYW1zLCBjdXN0b20uZmlsZXNUb0RlbGV0ZVByb3BlcnR5LCBbLi4uZmlsZXNUb0RlbGV0ZSwgaW5kZXhdKTtcbiAgICAgICAgICAgIG5ld1BhcmFtcyA9IGZsYXQuc2V0KG5ld1BhcmFtcywgY3VzdG9tLmZpbGVQYXRoUHJvcGVydHksIG5ld1BhdGgpO1xuICAgICAgICAgICAgb25DaGFuZ2Uoe1xuICAgICAgICAgICAgICAgIC4uLnJlY29yZCxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IG5ld1BhcmFtcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgY2Fubm90IHJlbW92ZSBmaWxlIHdoZW4gdGhlcmUgYXJlIG5vIHVwbG9hZGVkIGZpbGVzIHlldCcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCBudWxsLCB0cmFuc2xhdGVQcm9wZXJ0eShwcm9wZXJ0eS5sYWJlbCwgcHJvcGVydHkucmVzb3VyY2VJZCkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lLCB7IG9uQ2hhbmdlOiBvblVwbG9hZCwgbXVsdGlwbGU6IGN1c3RvbS5tdWx0aXBsZSwgdmFsaWRhdGU6IHtcbiAgICAgICAgICAgICAgICBtaW1lVHlwZXM6IGN1c3RvbS5taW1lVHlwZXMsXG4gICAgICAgICAgICAgICAgbWF4U2l6ZTogY3VzdG9tLm1heFNpemUsXG4gICAgICAgICAgICB9LCBmaWxlczogZmlsZXNUb1VwbG9hZCB9KSxcbiAgICAgICAgIWN1c3RvbS5tdWx0aXBsZSAmJiBrZXkgJiYgcGF0aCAmJiAhZmlsZXNUb1VwbG9hZC5sZW5ndGggJiYgZmlsZSAhPT0gbnVsbCAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZUl0ZW0sIHsgZmlsZW5hbWU6IGtleSwgc3JjOiBwYXRoLCBvblJlbW92ZTogaGFuZGxlUmVtb3ZlIH0pKSxcbiAgICAgICAgY3VzdG9tLm11bHRpcGxlICYmIGtleSAmJiBrZXkubGVuZ3RoICYmIHBhdGggPyAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwga2V5Lm1hcCgoc2luZ2xlS2V5LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgLy8gd2hlbiB3ZSByZW1vdmUgaXRlbXMgd2Ugc2V0IG9ubHkgcGF0aCBpbmRleCB0byBudWxscy5cbiAgICAgICAgICAgIC8vIGtleSBpcyBzdGlsbCB0aGVyZS4gVGhpcyBpcyBiZWNhdXNlXG4gICAgICAgICAgICAvLyB3ZSBoYXZlIHRvIG1haW50YWluIGFsbCB0aGUgaW5kZXhlcy4gU28gaGVyZSB3ZSBzaW1wbHkgZmlsdGVyIG91dCBlbGVtZW50cyB3aGljaFxuICAgICAgICAgICAgLy8gd2VyZSByZW1vdmVkIGFuZCBkaXNwbGF5IG9ubHkgd2hhdCB3YXMgbGVmdFxuICAgICAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSBwYXRoW2luZGV4XTtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50UGF0aCA/IChSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lSXRlbSwgeyBrZXk6IHNpbmdsZUtleSwgZmlsZW5hbWU6IHNpbmdsZUtleSwgc3JjOiBwYXRoW2luZGV4XSwgb25SZW1vdmU6ICgpID0+IGhhbmRsZU11bHRpUmVtb3ZlKHNpbmdsZUtleSkgfSkpIDogJyc7XG4gICAgICAgIH0pKSkgOiAnJykpO1xufTtcbmV4cG9ydCBkZWZhdWx0IEVkaXQ7XG4iLCJleHBvcnQgY29uc3QgQXVkaW9NaW1lVHlwZXMgPSBbXG4gICAgJ2F1ZGlvL2FhYycsXG4gICAgJ2F1ZGlvL21pZGknLFxuICAgICdhdWRpby94LW1pZGknLFxuICAgICdhdWRpby9tcGVnJyxcbiAgICAnYXVkaW8vb2dnJyxcbiAgICAnYXBwbGljYXRpb24vb2dnJyxcbiAgICAnYXVkaW8vb3B1cycsXG4gICAgJ2F1ZGlvL3dhdicsXG4gICAgJ2F1ZGlvL3dlYm0nLFxuICAgICdhdWRpby8zZ3BwMicsXG5dO1xuZXhwb3J0IGNvbnN0IFZpZGVvTWltZVR5cGVzID0gW1xuICAgICd2aWRlby94LW1zdmlkZW8nLFxuICAgICd2aWRlby9tcGVnJyxcbiAgICAndmlkZW8vb2dnJyxcbiAgICAndmlkZW8vbXAydCcsXG4gICAgJ3ZpZGVvL3dlYm0nLFxuICAgICd2aWRlby8zZ3BwJyxcbiAgICAndmlkZW8vM2dwcDInLFxuXTtcbmV4cG9ydCBjb25zdCBJbWFnZU1pbWVUeXBlcyA9IFtcbiAgICAnaW1hZ2UvYm1wJyxcbiAgICAnaW1hZ2UvZ2lmJyxcbiAgICAnaW1hZ2UvanBlZycsXG4gICAgJ2ltYWdlL3BuZycsXG4gICAgJ2ltYWdlL3N2Zyt4bWwnLFxuICAgICdpbWFnZS92bmQubWljcm9zb2Z0Lmljb24nLFxuICAgICdpbWFnZS90aWZmJyxcbiAgICAnaW1hZ2Uvd2VicCcsXG5dO1xuZXhwb3J0IGNvbnN0IENvbXByZXNzZWRNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL3gtYnppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtYnppcDInLFxuICAgICdhcHBsaWNhdGlvbi9nemlwJyxcbiAgICAnYXBwbGljYXRpb24vamF2YS1hcmNoaXZlJyxcbiAgICAnYXBwbGljYXRpb24veC10YXInLFxuICAgICdhcHBsaWNhdGlvbi96aXAnLFxuICAgICdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnLFxuXTtcbmV4cG9ydCBjb25zdCBEb2N1bWVudE1pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24veC1hYml3b3JkJyxcbiAgICAnYXBwbGljYXRpb24veC1mcmVlYXJjJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLmFtYXpvbi5lYm9vaycsXG4gICAgJ2FwcGxpY2F0aW9uL21zd29yZCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3QnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbicsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24nLFxuICAgICdhcHBsaWNhdGlvbi92bmQucmFyJyxcbiAgICAnYXBwbGljYXRpb24vcnRmJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnLFxuXTtcbmV4cG9ydCBjb25zdCBUZXh0TWltZVR5cGVzID0gW1xuICAgICd0ZXh0L2NzcycsXG4gICAgJ3RleHQvY3N2JyxcbiAgICAndGV4dC9odG1sJyxcbiAgICAndGV4dC9jYWxlbmRhcicsXG4gICAgJ3RleHQvamF2YXNjcmlwdCcsXG4gICAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICdhcHBsaWNhdGlvbi9sZCtqc29uJyxcbiAgICAndGV4dC9qYXZhc2NyaXB0JyxcbiAgICAndGV4dC9wbGFpbicsXG4gICAgJ2FwcGxpY2F0aW9uL3hodG1sK3htbCcsXG4gICAgJ2FwcGxpY2F0aW9uL3htbCcsXG4gICAgJ3RleHQveG1sJyxcbl07XG5leHBvcnQgY29uc3QgQmluYXJ5RG9jc01pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24vZXB1Yit6aXAnLFxuICAgICdhcHBsaWNhdGlvbi9wZGYnLFxuXTtcbmV4cG9ydCBjb25zdCBGb250TWltZVR5cGVzID0gW1xuICAgICdmb250L290ZicsXG4gICAgJ2ZvbnQvdHRmJyxcbiAgICAnZm9udC93b2ZmJyxcbiAgICAnZm9udC93b2ZmMicsXG5dO1xuZXhwb3J0IGNvbnN0IE90aGVyTWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgICdhcHBsaWNhdGlvbi94LWNzaCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5pbnN0YWxsZXIreG1sJyxcbiAgICAnYXBwbGljYXRpb24veC1odHRwZC1waHAnLFxuICAgICdhcHBsaWNhdGlvbi94LXNoJyxcbiAgICAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnLFxuICAgICd2bmQudmlzaW8nLFxuICAgICdhcHBsaWNhdGlvbi92bmQubW96aWxsYS54dWwreG1sJyxcbl07XG5leHBvcnQgY29uc3QgTWltZVR5cGVzID0gW1xuICAgIC4uLkF1ZGlvTWltZVR5cGVzLFxuICAgIC4uLlZpZGVvTWltZVR5cGVzLFxuICAgIC4uLkltYWdlTWltZVR5cGVzLFxuICAgIC4uLkNvbXByZXNzZWRNaW1lVHlwZXMsXG4gICAgLi4uRG9jdW1lbnRNaW1lVHlwZXMsXG4gICAgLi4uVGV4dE1pbWVUeXBlcyxcbiAgICAuLi5CaW5hcnlEb2NzTWltZVR5cGVzLFxuICAgIC4uLk90aGVyTWltZVR5cGVzLFxuICAgIC4uLkZvbnRNaW1lVHlwZXMsXG4gICAgLi4uT3RoZXJNaW1lVHlwZXMsXG5dO1xuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEljb24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IGZsYXQgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBBdWRpb01pbWVUeXBlcywgSW1hZ2VNaW1lVHlwZXMgfSBmcm9tICcuLi90eXBlcy9taW1lLXR5cGVzLnR5cGUuanMnO1xuY29uc3QgU2luZ2xlRmlsZSA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgbmFtZSwgcGF0aCwgbWltZVR5cGUsIHdpZHRoIH0gPSBwcm9wcztcbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCkge1xuICAgICAgICBpZiAobWltZVR5cGUgJiYgSW1hZ2VNaW1lVHlwZXMuaW5jbHVkZXMobWltZVR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IHBhdGgsIHN0eWxlOiB7IG1heEhlaWdodDogd2lkdGgsIG1heFdpZHRoOiB3aWR0aCB9LCBhbHQ6IG5hbWUgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtaW1lVHlwZSAmJiBBdWRpb01pbWVUeXBlcy5pbmNsdWRlcyhtaW1lVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIsIHsgY29udHJvbHM6IHRydWUsIHNyYzogcGF0aCB9LFxuICAgICAgICAgICAgICAgIFwiWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdGhlXCIsXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImNvZGVcIiwgbnVsbCwgXCJhdWRpb1wiKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJhY2tcIiwgeyBraW5kOiBcImNhcHRpb25zXCIgfSkpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBhczogXCJhXCIsIGhyZWY6IHBhdGgsIG1sOiBcImRlZmF1bHRcIiwgc2l6ZTogXCJzbVwiLCByb3VuZGVkOiB0cnVlLCB0YXJnZXQ6IFwiX2JsYW5rXCIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwgeyBpY29uOiBcIkRvY3VtZW50RG93bmxvYWRcIiwgY29sb3I6IFwid2hpdGVcIiwgbXI6IFwiZGVmYXVsdFwiIH0pLFxuICAgICAgICAgICAgbmFtZSkpKTtcbn07XG5jb25zdCBGaWxlID0gKHsgd2lkdGgsIHJlY29yZCwgcHJvcGVydHkgfSkgPT4ge1xuICAgIGNvbnN0IHsgY3VzdG9tIH0gPSBwcm9wZXJ0eTtcbiAgICBsZXQgcGF0aCA9IGZsYXQuZ2V0KHJlY29yZD8ucGFyYW1zLCBjdXN0b20uZmlsZVBhdGhQcm9wZXJ0eSk7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBuYW1lID0gZmxhdC5nZXQocmVjb3JkPy5wYXJhbXMsIGN1c3RvbS5maWxlTmFtZVByb3BlcnR5ID8gY3VzdG9tLmZpbGVOYW1lUHJvcGVydHkgOiBjdXN0b20ua2V5UHJvcGVydHkpO1xuICAgIGNvbnN0IG1pbWVUeXBlID0gY3VzdG9tLm1pbWVUeXBlUHJvcGVydHlcbiAgICAgICAgJiYgZmxhdC5nZXQocmVjb3JkPy5wYXJhbXMsIGN1c3RvbS5taW1lVHlwZVByb3BlcnR5KTtcbiAgICBpZiAoIXByb3BlcnR5LmN1c3RvbS5tdWx0aXBsZSkge1xuICAgICAgICBpZiAoY3VzdG9tLm9wdHMgJiYgY3VzdG9tLm9wdHMuYmFzZVVybCkge1xuICAgICAgICAgICAgcGF0aCA9IGAke2N1c3RvbS5vcHRzLmJhc2VVcmx9LyR7bmFtZX1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChTaW5nbGVGaWxlLCB7IHBhdGg6IHBhdGgsIG5hbWU6IG5hbWUsIHdpZHRoOiB3aWR0aCwgbWltZVR5cGU6IG1pbWVUeXBlIH0pKTtcbiAgICB9XG4gICAgaWYgKGN1c3RvbS5vcHRzICYmIGN1c3RvbS5vcHRzLmJhc2VVcmwpIHtcbiAgICAgICAgY29uc3QgYmFzZVVybCA9IGN1c3RvbS5vcHRzLmJhc2VVcmwgfHwgJyc7XG4gICAgICAgIHBhdGggPSBwYXRoLm1hcCgoc2luZ2xlUGF0aCwgaW5kZXgpID0+IGAke2Jhc2VVcmx9LyR7bmFtZVtpbmRleF19YCk7XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwgcGF0aC5tYXAoKHNpbmdsZVBhdGgsIGluZGV4KSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChTaW5nbGVGaWxlLCB7IGtleTogc2luZ2xlUGF0aCwgcGF0aDogc2luZ2xlUGF0aCwgbmFtZTogbmFtZVtpbmRleF0sIHdpZHRoOiB3aWR0aCwgbWltZVR5cGU6IG1pbWVUeXBlW2luZGV4XSB9KSkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRmlsZTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRmlsZSBmcm9tICcuL2ZpbGUuanMnO1xuY29uc3QgTGlzdCA9IChwcm9wcykgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsZSwgeyB3aWR0aDogMTAwLCAuLi5wcm9wcyB9KSk7XG5leHBvcnQgZGVmYXVsdCBMaXN0O1xuIiwiaW1wb3J0IHsgRm9ybUdyb3VwLCBMYWJlbCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRmlsZSBmcm9tICcuL2ZpbGUuanMnO1xuY29uc3QgU2hvdyA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgcHJvcGVydHkgfSA9IHByb3BzO1xuICAgIGNvbnN0IHsgdHJhbnNsYXRlUHJvcGVydHkgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgbnVsbCwgdHJhbnNsYXRlUHJvcGVydHkocHJvcGVydHkubGFiZWwsIHByb3BlcnR5LnJlc291cmNlSWQpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWxlLCB7IHdpZHRoOiBcIjEwMCVcIiwgLi4ucHJvcHMgfSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBTaG93O1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL2NvbXBvbmVudHMvRGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBVcGxvYWRFZGl0Q29tcG9uZW50IGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRFZGl0Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRFZGl0Q29tcG9uZW50ID0gVXBsb2FkRWRpdENvbXBvbmVudFxuaW1wb3J0IFVwbG9hZExpc3RDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZExpc3RDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZExpc3RDb21wb25lbnQgPSBVcGxvYWRMaXN0Q29tcG9uZW50XG5pbXBvcnQgVXBsb2FkU2hvd0NvbXBvbmVudCBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkU2hvd0NvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkU2hvd0NvbXBvbmVudCA9IFVwbG9hZFNob3dDb21wb25lbnQiXSwibmFtZXMiOlsiQXBpQ2xpZW50IiwiR09MRCIsIkRBUksiLCJEQVJLX0NBUkQiLCJEQVJLX1NVUkZBQ0UiLCJXSElURSIsIldISVRFXzYwIiwiV0hJVEVfNDAiLCJHUkFESUVOVF9HT0xEIiwiQ0FURUdPUllfSUNPTlMiLCJyaW5ncyIsImVhcnJpbmdzIiwiYnJhY2VsZXRzIiwicGVuZGFudHMiLCJjaGFpbnMiLCJiYW5nbGVzIiwic2V0cyIsImFzdHJvIiwiQ0FURUdPUllfTEFCRUxTIiwiRGFzaGJvYXJkIiwic3RhdHMiLCJzZXRTdGF0cyIsInVzZVN0YXRlIiwibG9hZGluZyIsInNldExvYWRpbmciLCJ1c2VFZmZlY3QiLCJmZXRjaFN0YXRzIiwicmVzcG9uc2UiLCJmZXRjaCIsIm9rIiwiZGF0YSIsImpzb24iLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJub3ciLCJEYXRlIiwiZ3JlZXRpbmciLCJnZXRIb3VycyIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkJveCIsInN0eWxlIiwiYmFja2dyb3VuZCIsIm1pbkhlaWdodCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJ0ZXh0QWxpZ24iLCJUZXh0IiwiY29sb3IiLCJmb250U2l6ZSIsIm1hcmdpbkJvdHRvbSIsImxldHRlclNwYWNpbmciLCJ0ZXh0VHJhbnNmb3JtIiwidG90YWxQcm9kdWN0cyIsImluU3RvY2siLCJvdXRPZlN0b2NrIiwid2l0aE9mZmVycyIsImNhdGVnb3J5QnJlYWtkb3duIiwicmVjZW50UHJvZHVjdHMiLCJ0b3RhbE9yZGVycyIsInBhZGRpbmciLCJib3JkZXJCb3R0b20iLCJwb3NpdGlvbiIsIm92ZXJmbG93IiwiaW5zZXQiLCJvcGFjaXR5IiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFNpemUiLCJ6SW5kZXgiLCJtYXhXaWR0aCIsIm1hcmdpbiIsImZvbnRXZWlnaHQiLCJIMiIsImZvbnRGYW1pbHkiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJ3ZWVrZGF5IiwieWVhciIsIm1vbnRoIiwiZGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImdhcCIsIlN0YXRDYXJkIiwiaWNvbiIsImxhYmVsIiwidmFsdWUiLCJhY2NlbnQiLCJib3JkZXJSYWRpdXMiLCJib3JkZXIiLCJINCIsImZsZXhEaXJlY3Rpb24iLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwiY2F0IiwiY291bnQiLCJDYXRlZ29yeUJhciIsImtleSIsImNhdGVnb3J5IiwidG90YWwiLCJrZXlzIiwibGVuZ3RoIiwiZm9udFN0eWxlIiwiZmxleCIsIkFjdGlvbkJ1dHRvbiIsImhyZWYiLCJkZXNjcmlwdGlvbiIsInRleHREZWNvcmF0aW9uIiwicHJvZHVjdCIsIlByb2R1Y3RDYXJkIiwiX2lkIiwibWFyZ2luVG9wIiwicGFkZGluZ1RvcCIsImJvcmRlclRvcCIsInRyYW5zaXRpb24iLCJ0b3AiLCJsZWZ0IiwicmlnaHQiLCJoZWlnaHQiLCJsaW5lSGVpZ2h0IiwicGVyY2VudGFnZSIsIk1hdGgiLCJyb3VuZCIsIndpZHRoIiwiY3Vyc29yIiwib25Nb3VzZUVudGVyIiwiZSIsImN1cnJlbnRUYXJnZXQiLCJib3JkZXJDb2xvciIsIm9uTW91c2VMZWF2ZSIsImltYWdlS2V5cyIsImNhdGVnb3J5SWNvbiIsImNhdGVnb3J5TGFiZWwiLCJ0cmFuc2Zvcm0iLCJmbGV4U2hyaW5rIiwibWluV2lkdGgiLCJ0ZXh0T3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwibmFtZSIsInByaWNlIiwidG9Mb2NhbGVTdHJpbmciLCJzdG9ja1N0YXR1cyIsImNyZWF0ZWRBdCIsInVzZVRyYW5zbGF0aW9uIiwiZmxhdCIsIkZvcm1Hcm91cCIsIkxhYmVsIiwiRHJvcFpvbmUiLCJEcm9wWm9uZUl0ZW0iLCJCdXR0b24iLCJJY29uIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiVXBsb2FkRWRpdENvbXBvbmVudCIsIlVwbG9hZExpc3RDb21wb25lbnQiLCJVcGxvYWRTaG93Q29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBV1ksSUFBSUEsaUJBQVM7O0VBRXpCO0VBQ0EsTUFBTUMsSUFBSSxHQUFHLFNBQVM7RUFDdEIsTUFBTUMsSUFBSSxHQUFHLFNBQVM7RUFDdEIsTUFBTUMsU0FBUyxHQUFHLFNBQVM7RUFDM0IsTUFBTUMsWUFBWSxHQUFHLFNBQVM7RUFDOUIsTUFBTUMsS0FBSyxHQUFHLFNBQVM7RUFDdkIsTUFBTUMsUUFBUSxHQUFHLHVCQUF1QjtFQUN4QyxNQUFNQyxRQUFRLEdBQUcsdUJBQXVCO0VBQ3hDLE1BQU1DLGFBQWEsR0FBRyxnRUFBZ0U7RUFHdEYsTUFBTUMsY0FBYyxHQUFHO0VBQ3JCQyxFQUFBQSxLQUFLLEVBQUUsSUFBSTtFQUNYQyxFQUFBQSxRQUFRLEVBQUUsR0FBRztFQUNiQyxFQUFBQSxTQUFTLEVBQUUsSUFBSTtFQUNmQyxFQUFBQSxRQUFRLEVBQUUsSUFBSTtFQUNkQyxFQUFBQSxNQUFNLEVBQUUsSUFBSTtFQUNaQyxFQUFBQSxPQUFPLEVBQUUsR0FBRztFQUNaQyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUNWQyxFQUFBQSxLQUFL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
