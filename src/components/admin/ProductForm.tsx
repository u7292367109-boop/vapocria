'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { categories } from '@/lib/mock-data'
import toast from 'react-hot-toast'
import Link from 'next/link'

const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  short_description: z.string().min(10, 'Descrição curta deve ter pelo menos 10 caracteres'),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres'),
  price: z.coerce.number().positive('Preço deve ser positivo'),
  compare_at_price: z.coerce.number().min(0).optional().or(z.literal('')),
  cost_price: z.coerce.number().min(0).optional().or(z.literal('')),
  sku: z.string().min(1, 'SKU é obrigatório'),
  barcode: z.string().optional(),
  stock_quantity: z.coerce.number().int().min(0, 'Estoque não pode ser negativo'),
  low_stock_threshold: z.coerce.number().int().min(0),
  category_id: z.string().min(1, 'Selecione uma categoria'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  nicotine_strength: z.string().optional(),
  flavor: z.string().optional(),
  puff_count: z.coerce.number().int().min(0).optional().or(z.literal('')),
  battery_capacity: z.string().optional(),
  volume: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
})

export type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>
  isEditing?: boolean
  images?: string[]
  thumbnail?: string
}

export default function ProductForm({ defaultValues, isEditing = false, images: initialImages, thumbnail: initialThumbnail }: ProductFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(defaultValues?.brand ? [] : [])
  const [tagInput, setTagInput] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages || [''])
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnail || '')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '', slug: '', short_description: '', description: '',
      price: 0, compare_at_price: '', cost_price: '',
      sku: '', barcode: '', stock_quantity: 0, low_stock_threshold: 10,
      category_id: '', brand: '', nicotine_strength: '', flavor: '',
      puff_count: '', battery_capacity: '', volume: '',
      meta_title: '', meta_description: '',
      is_active: true, is_featured: false,
      ...defaultValues,
    },
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue('name', name)
    setValue('slug', slugify(name))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))
  const addImageUrl = () => setImageUrls([...imageUrls, ''])
  const removeImageUrl = (index: number) => setImageUrls(imageUrls.filter((_, i) => i !== index))
  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(isEditing ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!')
      router.push('/admin/produtos')
    } catch {
      toast.error('Erro ao salvar produto')
    }
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  const inputClass = "w-full px-3 py-2.5 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm placeholder-dark-500 outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-colors"

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center gap-4">
        <Link href="/admin/produtos">
          <button className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
          <p className="text-sm text-dark-400 mt-1">{isEditing ? 'Atualize as informações do produto' : 'Preencha os dados do novo produto'}</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Info */}
            <motion.div variants={item} className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-4">Informações Básicas</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Nome do Produto</label>
                  <input {...register('name')} onChange={handleNameChange} className={inputClass} placeholder="Ex: Ignite V80 - Blueberry Ice" />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Slug</label>
                  <input {...register('slug')} className={`${inputClass} text-dark-400`} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Descrição Curta</label>
                  <input {...register('short_description')} className={inputClass} placeholder="Breve descrição do produto" />
                  {errors.short_description && <p className="text-xs text-red-400 mt-1">{errors.short_description.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Descrição Completa</label>
                  <textarea {...register('description')} rows={5} className={`${inputClass} resize-none`} placeholder="Descrição detalhada..." />
                  {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
                </div>
              </div>
            </motion.div>

            {/* Prices */}
            <motion.div variants={item} className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-4">Preços</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Preço (R$)</label>
                  <input type="number" step="0.01" {...register('price')} className={inputClass} placeholder="0.00" />
                  {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Preço Comparativo</label>
                  <input type="number" step="0.01" {...register('compare_at_price')} className={inputClass} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Preço de Custo</label>
                  <input type="number" step="0.01" {...register('cost_price')} className={inputClass} placeholder="0.00" />
                </div>
              </div>
            </motion.div>

            {/* Inventory */}
            <motion.div variants={item} className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-4">Estoque</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">SKU</label>
                  <input {...register('sku')} className={`${inputClass} font-mono`} placeholder="EX-SKU-001" />
                  {errors.sku && <p className="text-xs text-red-400 mt-1">{errors.sku.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Código de Barras</label>
                  <input {...register('barcode')} className={inputClass} placeholder="Opcional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Quantidade</label>
                  <input type="number" {...register('stock_quantity')} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Limite Estoque Baixo</label>
                  <input type="number" {...register('low_stock_threshold')} className={inputClass} />
                </div>
              </div>
            </motion.div>

            {/* Vape Specs */}
            <motion.div variants={item} className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-4">Especificações do Vape</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Nicotina</label>
                  <input {...register('nicotine_strength')} className={inputClass} placeholder="Ex: 50mg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Sabor</label>
                  <input {...register('flavor')} className={inputClass} placeholder="Ex: Blueberry Ice" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Puffs</label>
                  <input type="number" {...register('puff_count')} className={inputClass} placeholder="Ex: 8000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Bateria</label>
                  <input {...register('battery_capacity')} className={inputClass} placeholder="Ex: 550mAh" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Volume</label>
                  <input {...register('volume')} className={inputClass} placeholder="Ex: 16ml" />
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div variants={item} className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-4">Imagens</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">URL da Thumbnail</label>
                  <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className={inputClass} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-3">URLs das Imagens</label>
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input value={url} onChange={(e) => updateImageUrl(index, e.target.value)} className={`flex-1 ${inputClass}`} placeholder="https://..." />
                      {imageUrls.length > 1 && (
                        <button type="button" onClick={() => removeImageUrl(index)} className="p-2.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addImageUrl} className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors mt-2">
                    <Plus className="w-4 h-4" /> Adicionar imagem
                  </button>
                </div>
              </div>
            </motion.div>

            {/* SEO */}
            <motion.div variants={item} className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-4">SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Meta Title</label>
                  <input {...register('meta_title')} className={inputClass} placeholder="Título para SEO" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Meta Description</label>
                  <textarea {...register('meta_description')} rows={3} className={`${inputClass} resize-none`} placeholder="Descrição para mecanismos de busca" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div variants={item} className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-4">Organização</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Categoria</label>
                  <select {...register('category_id')} className={inputClass}>
                    <option value="">Selecionar...</option>
                    {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                  {errors.category_id && <p className="text-xs text-red-400 mt-1">{errors.category_id.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Marca</label>
                  <input {...register('brand')} className={inputClass} placeholder="Ex: Ignite" />
                  {errors.brand && <p className="text-xs text-red-400 mt-1">{errors.brand.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Tags</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs rounded-md">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} className={`flex-1 ${inputClass}`} placeholder="Adicionar tag" />
                    <button type="button" onClick={addTag} className="px-3 py-2 bg-dark-700 text-white rounded-lg text-sm hover:bg-dark-600 transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6">
              <h2 className="text-base font-semibold text-white mb-4">Status</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-dark-300">Produto Ativo</span>
                  <input type="checkbox" {...register('is_active')} className="sr-only peer" />
                  <div className="relative w-10 h-5 bg-dark-600 peer-checked:bg-primary-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] peer-checked:after:translate-x-[20px] after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform after:shadow-sm" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-dark-300">Produto em Destaque</span>
                  <input type="checkbox" {...register('is_featured')} className="sr-only peer" />
                  <div className="relative w-10 h-5 bg-dark-600 peer-checked:bg-accent-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] peer-checked:after:translate-x-[20px] after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform after:shadow-sm" />
                </label>
              </div>
            </motion.div>

            <motion.div variants={item} className="flex flex-col gap-3">
              <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors">
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
              </motion.button>
              <Link href="/admin/produtos" className="w-full">
                <button type="button" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dark-800/50 border border-dark-700/50 text-dark-300 hover:text-white rounded-lg text-sm font-medium transition-colors">Cancelar</button>
              </Link>
            </motion.div>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
