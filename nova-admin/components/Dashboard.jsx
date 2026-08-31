import React, { useState, useEffect } from 'react';
import { ApiClient } from 'adminjs';
import {
  Box,
  H2,
  H4,
  Text,
  Button,
  Icon,
} from '@adminjs/design-system';

const api = new ApiClient();

// ─── Styling constants ──────────────────────────────────────────────────────
const GOLD = '#c5a880';
const DARK = '#0b0e17';
const DARK_CARD = '#111627';
const DARK_SURFACE = '#181c2b';
const WHITE = '#f5f5f5';
const WHITE_60 = 'rgba(255,255,255,0.6)';
const WHITE_40 = 'rgba(255,255,255,0.4)';
const GRADIENT_GOLD = 'linear-gradient(135deg, #c5a880 0%, #e8d5b7 50%, #c5a880 100%)';
const GRADIENT_DARK = 'linear-gradient(135deg, #0b0e17 0%, #181c2b 100%)';

const CATEGORY_ICONS = {
  'gifts-for-her': '🎀',
  'gifts-for-him': '🎁',
  'astro-collection': '✨',
};

const CATEGORY_LABELS = {
  'gifts-for-her': 'Gifts For Her',
  'gifts-for-him': 'Gifts For Him',
  'astro-collection': 'Astro Collection',
};

// ─── Main Dashboard Component ───────────────────────────────────────────────
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  const greeting =
    now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  if (loading) {
    return (
      <Box
        style={{
          background: DARK,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box style={{ textAlign: 'center' }}>
          <Text style={{ color: GOLD, fontSize: 48, marginBottom: 16 }}>💎</Text>
          <Text style={{ color: WHITE_60, fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Loading Dashboard...
          </Text>
        </Box>
      </Box>
    );
  }

  const totalProducts = stats?.totalProducts || 0;
  const inStock = stats?.inStock || 0;
  const outOfStock = stats?.outOfStock || 0;
  const withOffers = stats?.withOffers || 0;
  const categoryBreakdown = stats?.categoryBreakdown || {};
  const recentProducts = stats?.recentProducts || [];
  const totalOrders = stats?.totalOrders || 0;

  return (
    <Box style={{ background: DARK, minHeight: '100vh', padding: 0 }}>
      {/* ─── Hero Banner ─────────────────────────────────────────── */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #0b0e17 0%, #1a1f33 50%, #0b0e17 100%)',
          padding: '48px 40px 40px',
          borderBottom: `1px solid rgba(197,168,128,0.15)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative dots pattern */}
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(#c5a880 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <Box style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <Text
            style={{
              color: GOLD,
              fontSize: 10,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            NOVA JEWELLERY — COMMAND CENTER
          </Text>
          <H2
            style={{
              color: WHITE,
              fontSize: 32,
              fontWeight: 300,
              letterSpacing: '0.02em',
              marginBottom: 8,
              fontFamily: '"Playfair Display", Georgia, serif',
            }}
          >
            {greeting}, Admin 👋
          </H2>
          <Text style={{ color: WHITE_60, fontSize: 14, fontWeight: 300 }}>
            Here's what's happening with your jewellery catalogue today —{' '}
            {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </Box>
      </Box>

      {/* ─── Content Area ────────────────────────────────────────── */}
      <Box style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 40px 60px' }}>
        {/* ─── KPI Cards Row ───────────────────────────────────── */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 32,
          }}
        >
          <StatCard
            icon="📦"
            label="Total Products"
            value={totalProducts}
            accent={GOLD}
          />
          <StatCard
            icon="✅"
            label="In Stock"
            value={inStock}
            accent="#4ade80"
          />
          <StatCard
            icon="🚫"
            label="Out of Stock"
            value={outOfStock}
            accent="#f87171"
          />
          <StatCard
            icon="🏷️"
            label="Active Offers"
            value={withOffers}
            accent="#818cf8"
          />
          <StatCard
            icon="🛒"
            label="Total Orders"
            value={totalOrders}
            accent="#38bdf8"
          />
        </Box>

        {/* ─── Two-column layout ───────────────────────────────── */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            marginBottom: 32,
          }}
        >
          {/* Category Breakdown */}
          <Box
            style={{
              background: DARK_CARD,
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.06)',
              padding: 28,
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Text style={{ fontSize: 20 }}>📊</Text>
              <H4
                style={{
                  color: WHITE,
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  margin: 0,
                }}
              >
                Products by Category
              </H4>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(categoryBreakdown).map(([cat, count]) => (
                <CategoryBar
                  key={cat}
                  category={cat}
                  count={count}
                  total={totalProducts}
                />
              ))}
              {Object.keys(categoryBreakdown).length === 0 && (
                <Text style={{ color: WHITE_40, fontSize: 13, fontStyle: 'italic' }}>
                  No products yet. Add your first product to see category stats.
                </Text>
              )}
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box
            style={{
              background: DARK_CARD,
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.06)',
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Text style={{ fontSize: 20 }}>⚡</Text>
              <H4
                style={{
                  color: WHITE,
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  margin: 0,
                }}
              >
                Quick Actions
              </H4>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <ActionButton
                href="/admin/resources/Product/actions/new"
                icon="➕"
                label="Add New Product"
                description="Create a new jewellery listing with images"
              />
              <ActionButton
                href="/admin/resources/Product"
                icon="📋"
                label="View All Products"
                description="Browse and manage your full catalogue"
              />
              <ActionButton
                href="/admin/resources/Product?filters.stockStatus=OUT_OF_STOCK"
                icon="⚠️"
                label="Out of Stock Items"
                description="Review products that need restocking"
              />
              <ActionButton
                href="/admin/resources/Product?filters.hasActiveOffer=true"
                icon="🏷️"
                label="Active Offers"
                description="Manage running discounts and coupons"
              />
            </Box>
          </Box>
        </Box>

        {/* ─── Recent Products ─────────────────────────────────── */}
        <Box
          style={{
            background: DARK_CARD,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.06)',
            padding: 28,
          }}
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 20 }}>🕐</Text>
              <H4
                style={{
                  color: WHITE,
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  margin: 0,
                }}
              >
                Recently Added Products
              </H4>
            </Box>
            <a
              href="/admin/resources/Product"
              style={{
                color: GOLD,
                fontSize: 12,
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              View All →
            </a>
          </Box>

          {recentProducts.length > 0 ? (
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {recentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Box>
          ) : (
            <Box
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                borderRadius: 12,
                border: '1px dashed rgba(255,255,255,0.1)',
              }}
            >
              <Text style={{ fontSize: 40, marginBottom: 12 }}>✨</Text>
              <Text style={{ color: WHITE_60, fontSize: 14 }}>
                No products yet. Click "Add New Product" to get started!
              </Text>
            </Box>
          )}
        </Box>

        {/* ─── Footer ──────────────────────────────────────────── */}
        <Box
          style={{
            textAlign: 'center',
            marginTop: 40,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Text style={{ color: WHITE_40, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            NOVA Jewellery Admin • 925 Sterling Silver Collection
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, accent }) => (
  <Box
    style={{
      background: DARK_CARD,
      borderRadius: 14,
      padding: '24px 22px',
      border: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}
  >
    <Box
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: accent,
        borderRadius: '14px 14px 0 0',
      }}
    />
    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Text style={{ color: WHITE_40, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          {label}
        </Text>
        <Text style={{ color: WHITE, fontSize: 32, fontWeight: 700, lineHeight: 1, fontFamily: '"Inter", sans-serif' }}>
          {value}
        </Text>
      </Box>
      <Text style={{ fontSize: 32, opacity: 0.8 }}>{icon}</Text>
    </Box>
  </Box>
);

const CategoryBar = ({ category, count, total }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  const icon = CATEGORY_ICONS[category] || '📦';
  const label = CATEGORY_LABELS[category] || category;

  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 10,
        background: DARK_SURFACE,
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <Text style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{icon}</Text>
      <Box style={{ flex: 1 }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ color: WHITE, fontSize: 13, fontWeight: 500 }}>{label}</Text>
          <Text style={{ color: GOLD, fontSize: 12, fontWeight: 600 }}>
            {count} <span style={{ color: WHITE_40, fontWeight: 400 }}>({percentage}%)</span>
          </Text>
        </Box>
        <Box
          style={{
            height: 4,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          <Box
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: GRADIENT_GOLD,
              borderRadius: 4,
              transition: 'width 0.6s ease',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const ActionButton = ({ href, icon, label, description }) => (
  <a
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 18px',
      borderRadius: 12,
      background: DARK_SURFACE,
      border: '1px solid rgba(255,255,255,0.06)',
      textDecoration: 'none',
      transition: 'all 0.25s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(197,168,128,0.3)';
      e.currentTarget.style.background = '#1e2338';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.background = DARK_SURFACE;
    }}
  >
    <Text style={{ fontSize: 22 }}>{icon}</Text>
    <Box>
      <Text style={{ color: WHITE, fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{label}</Text>
      <Text style={{ color: WHITE_40, fontSize: 11, fontWeight: 300 }}>{description}</Text>
    </Box>
  </a>
);

const ProductCard = ({ product }) => {
  const r2PublicUrl = ''; // Will use relative URLs from imageKeys
  const firstImageKey = product.imageKeys?.[0];
  const imageUrl = firstImageKey ? `/admin/api/product-image?key=${encodeURIComponent(firstImageKey)}` : null;
  const categoryIcon = CATEGORY_ICONS[product.category] || '📦';
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;

  return (
    <a
      href={`/admin/resources/Product/records/${product._id}/show`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 12,
        background: DARK_SURFACE,
        border: '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(197,168,128,0.25)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail */}
      <Box
        style={{
          width: 56,
          height: 56,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Text style={{ fontSize: 28 }}>{categoryIcon}</Text>
      </Box>

      {/* Info */}
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            color: WHITE,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.name}
        </Text>
        <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>₹{product.price?.toLocaleString('en-IN')}</Text>
          <Text
            style={{
              color: WHITE_40,
              fontSize: 10,
              background: 'rgba(255,255,255,0.06)',
              padding: '2px 8px',
              borderRadius: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {categoryLabel}
          </Text>
          <Text
            style={{
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 600,
              background: product.stockStatus === 'IN_STOCK' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
              color: product.stockStatus === 'IN_STOCK' ? '#4ade80' : '#f87171',
            }}
          >
            {product.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out'}
          </Text>
        </Box>
      </Box>

      {/* Date */}
      <Text style={{ color: WHITE_40, fontSize: 10, flexShrink: 0 }}>
        {product.createdAt
          ? new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
          : '—'}
      </Text>
    </a>
  );
};

export default Dashboard;
