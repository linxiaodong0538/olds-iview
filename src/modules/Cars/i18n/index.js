import i18n from '@/i18n'

i18n.addResources('cars', require.context('./locales/', true, /\.json$/))
